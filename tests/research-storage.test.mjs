import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import express from 'express';
import { researchDataHandler } from '../server/researchDataStore.js';
import { ResearchDataStore, jsonClone } from '../client/src/data/ResearchDataStore.js';
import { GameStateManager } from '../client/src/game/GameStateManager.js';
import { exportResearchData } from '../scripts/export-research-data.mjs';
import { CONFIG } from '../client/src/config/gameConfig.js';

class MemoryLocal {
  rows = new Map();
  async put(r) {
    const old = this.rows.get(r.sessionId);
    if (!old || old.revision < r.revision || (old.revision === r.revision && old.pending)) this.rows.set(r.sessionId, jsonClone(r));
  }
  async all() { return jsonClone([...this.rows.values()]); }
}
const quiet = console.log; console.log = () => {};
const directory = await mkdtemp(path.join(tmpdir(), 'cake-storage-test-'));
const app = express(); app.use(express.json({ limit: '8mb' }));
app.post('/api/research/snapshots', researchDataHandler(directory));
const server = app.listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const endpoint = `http://127.0.0.1:${server.address().port}/api/research/snapshots`;
const stores = [];
function create(options = {}) { const store = new ResearchDataStore({ endpoint, ...options }); stores.push(store); return store; }
try {
  const local = new MemoryLocal(); const states = [];
  let online = false;
  const store = create({ local, onStatus: s => states.push(s), fetchImpl: (...args) => { if (!online) throw Error('offline'); return fetch(...args); } });
  const payload = { allTrialsData: [{ trialId: 't1', claimedSmallGoals: new Set([1]) }], comprehensionCheckData: { questions: [{ attempts: 2 }] }, cupcakeWidgetRedOnRight: true };
  await store.save(payload); await store.flush();
  assert.equal((await local.all())[0].pending, true);
  assert(states.includes('pending')); assert(!states.includes('server'));
  // Reload: a new store uploads the old pending session, without conflating IDs.
  const reloaded = create({ local });
  assert.notEqual(reloaded.sessionId, store.sessionId);
  await reloaded.flush();
  const stored = (await local.all())[0]; assert.equal(stored.pending, false);
  const recordPath = path.join(directory, store.sessionId, '000000001.json');
  const record = JSON.parse(await readFile(recordPath, 'utf8'));
  assert.deepEqual(record.snapshot.allTrialsData[0].claimedSmallGoals, [1]);
  assert.equal(record.snapshot.cupcakeWidgetRedOnRight, true);
  const body = { sessionId: store.sessionId, writeToken: store.writeToken, revision: 1, snapshot: record.snapshot };
  const post = obj => fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
  const duplicate = await post(body); assert.equal(duplicate.status, 200);
  assert.equal((await duplicate.json()).savedAt, record.savedAt);
  assert.equal((await post({ ...body, snapshot: { ...body.snapshot, changed: true } })).status, 409);
  assert.equal((await post({ ...body, writeToken: '0'.repeat(32) })).status, 403);
  assert.equal((await post({ ...body, sessionId: '../escape' })).status, 400);
  assert.equal((await post({ ...body, revision: 5 })).status, 200);
  assert.equal((await post({ ...body, revision: 3 })).status, 200);
  assert.equal((await readdir(path.join(directory, store.sessionId))).filter(f => f.endsWith('.json')).length, 3);
  assert.equal((await fetch(endpoint)).status, 404);
  assert.equal((await reloaded.exportLocal())[0].writeToken, undefined);
  // Invalid HTTP acknowledgements never mark data saved.
  for (const response of [{ ok: false, status: 500 }, { ok: true, json: async () => ({ saved: true, sessionId: 'wrong', revision: 1 }) }, { type: 'opaque', status: 0 }]) {
    const db = new MemoryLocal(); const s = create({ local: db, fetchImpl: async () => response });
    await s.save(payload); await s.flush(); assert.equal((await db.all())[0].pending, true);
  }
  // Slow acknowledgement for revision 1 must not overwrite a concurrently queued revision 2.
  const db = new MemoryLocal(); let release; let started;
  const start = new Promise(r => started = r);
  const race = create({ local: db, fetchImpl: async (_url, opts) => {
    const request = JSON.parse(opts.body);
    if (request.revision === 1) { started(); await new Promise(r => release = r); }
    return { ok: true, json: async () => ({ saved: true, sessionId: request.sessionId, revision: request.revision, savedAt: 'now' }) };
  } });
  await race.save(payload); const uploading = race.flush(); await start;
  await race.save({ ...payload, marker: 'newest' }); release(); await uploading; await race.flush();
  const latest = (await db.all())[0]; assert.equal(latest.revision, 2); assert.equal(latest.snapshot.marker, 'newest');
  // Browser storage failure still allows server saving and a memory download.
  const failedLocal = create({ local: { put: async () => { throw Error('quota'); }, all: async () => { throw Error('disabled'); } } });
  await failedLocal.save(payload); await failedLocal.flush();
  assert.equal((await failedLocal.exportLocal())[0].pending, false);
  const analysisFolder = path.join(directory, 'analysis-export');
  const counts = await exportResearchData(directory, analysisFolder);
  assert(counts.sessions >= 1); assert(counts.trials >= 1);
  const exported = (await readFile(path.join(analysisFolder, 'sessions.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse);
  assert.equal(exported.find(s => s.sessionId === store.sessionId).revision, 5);
  assert(!JSON.stringify(exported).includes(store.writeToken));
  await assert.rejects(exportResearchData(directory, analysisFolder), /EEXIST/);
  // Real disk failure returns an error, not a successful receipt.
  const fileRoot = path.join(directory, 'not-a-directory'); await writeFile(fileRoot, 'x');
  const failedHandler = researchDataHandler(fileRoot); let failureStatus;
  await failedHandler({ body }, { status(n) { failureStatus = n; return this; }, json() {} });
  assert.equal(failureStatus, 500);

  // Game lifecycle: explicit timeout, final state, new trial isolation, typed sets.
  const gs = new GameStateManager();
  const design = { initPlayerGrid: [0,0], initAIGrid: [0,4], bigGoals: [[0,2]], smallGoals: [[4,0],[4,4]], gridSize: 5, obstacles: [], trial_phase: 'main', utility_summary: { hare_reward_each: 1, stag_reward_each: 5 }, participant_rewards: { initial_points: 0, step_penalty: 0 } };
  gs.initializeTrial(0, 'StagHunt', design);
  const firstId = gs.trialData.trialId;
  gs.recordEvent('human_input', { direction: 'right', actor: 1 });
  gs.processSynchronizedMoves('right', 'left'); gs.isMoving = false;
  gs.finalizeTrial(false, { timeout: true });
  const trial = gs.experimentData.allTrialsData[0];
  assert.equal(trial.status, 'ended'); assert.equal(trial.timeout, true); assert.equal(trial.terminationReason, 'time_limit');
  assert.deepEqual(trial.player1FinalPosition, [0,1]); assert(Array.isArray(trial.claimedSmallGoals));
  assert.equal(trial.events.find(e => e.type === 'turn_committed').turnId, 0);
  assert.equal(trial.actualRewards.smallGoalReward, 1);
  gs.initializeTrial(1, 'StagHunt', design); assert.notEqual(gs.trialData.trialId, firstId); assert.equal(gs.trialData.timeout, false); assert.equal(gs.trialData.finalState, null);
  gs.stepCount = CONFIG.game.maxGameLength; gs.finalizeTrial(false); assert.equal(gs.trialData.terminationReason, 'step_limit');

  gs.initializeTrial(2, 'StagHunt', design);
  gs.currentState.player1 = [0,2]; gs.currentState.player2 = [0,2]; gs.stepCount = CONFIG.game.maxGameLength;
  gs.finalizeTrial(true); assert.equal(gs.trialData.terminationReason, 'goals_resolved');
  // Actual workbook assembly, with serialization/transport mocked to avoid research uploads.
  globalThis.window = { location: { origin: 'http://test.invalid', search: '' }, io: null };
  const { GameApplication } = await import('../client/src/core/GameApplication.js');
  let workbook; let notifications = [];
  window.XLSX = { utils: { book_new: () => ({ sheets: {} }), aoa_to_sheet: r => r, book_append_sheet: (b,r,n) => b.sheets[n] = r }, write: b => { workbook = b; return new Uint8Array([1]); } };
  const game = Object.create(GameApplication.prototype);
  Object.assign(game, { gameStateManager: gs, playerIndex: 0, timelineManager: { emit: e => notifications.push(e) }, experimentManager: { cakeVisualization: { redOnRight: true } } });
  gs.experimentData.allTrialsData.push({ trialId: 'practice', experimentType: 'StagHunt', trialPhase: 'onboarding', player2StartPosition: null, collaborationSucceeded: true });
  const originalFetch = globalThis.fetch; globalThis.fetch = async () => ({ type: 'opaque', status: 0 });
  const oldDrive = CONFIG.server.enableGoogleDriveSave; CONFIG.server.enableGoogleDriveSave = true;
  try { await game.saveExperimentData({ participantId: 'TEST', comprehensionCheck: { questions: [{ name: 'test', attempts: 2, firstAttemptCorrect: false, finalAnswer: '5', history: [{ correct: false }, { correct: true }] }] } }, { showAlert: false }); await new Promise(r => setTimeout(r, 0)); }
  finally { globalThis.fetch = originalFetch; CONFIG.server.enableGoogleDriveSave = oldDrive; }
  assert.equal(workbook.sheets.Meta.find(row => row[0] === 'collaborationTrialsTotal')[1], 3);
  assert(workbook.sheets.Comprehension); assert(workbook.sheets.SessionMetadata);
  assert.equal(workbook.sheets.Meta.find(row => row[0] === 'cupcakeWidgetRedOnRight')[1], true);
  assert.equal(workbook.sheets.Comprehension[1][1], 2);
  assert(!notifications.includes('data-save-success'));
  console.log = quiet;
  console.log('PASS: durable HTTP snapshots, duplicate/conflict/auth checks, disk failures, offline/reload retry, invalid/opaque ACK rejection, revision race, backup fallback, trial IDs/timeouts/final state, Set serialization, comprehension/layout workbook export.');
} finally {
  console.log = quiet;
  for (const store of stores) clearTimeout(store.uploadTimer);
  await new Promise(r => server.close(r));
  await rm(directory, { recursive: true, force: true });
}
