import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Read the actual downloaded Drive workbook, not an in-memory export.
const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../client/public/vendor/xlsx.full.min.js', import.meta.url), 'utf8'), context);
const XLSX = context.XLSX;
const workbook = XLSX.read(fs.readFileSync(process.argv[2]), { type: 'buffer' });
const rows = name => XLSX.utils.sheet_to_json(workbook.Sheets[name]);
const raw = XLSX.utils.sheet_to_json(workbook.Sheets.RawJSON, { header: 1 }).slice(1);
const snapshot = JSON.parse(Buffer.from(raw.map(row => row[1]).join(''), 'base64').toString('utf8'));
const trials = snapshot.allTrialsData;
assert.equal(trials.length, 21, '21 completed trials');
assert.deepEqual(trials.map(t => t.trialIndex), Array.from({ length: 21 }, (_, i) => i));
assert.equal(new Set(trials.map(t => t.trialId)).size, 21);
assert.equal(trials.filter(t => t.trialPhase === 'main').length, 16);
assert.equal(new Set(trials.filter(t => t.trialPhase === 'main').map(t => t.sourceMapId)).size, 16);
assert.equal(trials.filter(t => t.player2StartPosition).length, 20);
const summary = [];
for (const trial of trials) {
  const label = `trial ${trial.trialIndex}`;
  assert.equal(trial.status, 'ended', label);
  assert(trial.finalState && trial.mapDesign && trial.actualRewards, label);
  assert(trial.endTime >= trial.trialStartTime, label);
  const turns = trial.events.filter(e => e.type === 'turn_committed');
  assert.equal(turns.length, trial.totalSteps, label);
  assert.deepEqual(turns.map(e => e.turnId), Array.from({ length: turns.length }, (_, i) => i), label);
  assert.equal(trial.events.filter(e => e.type === 'trial_started').length, 1, label);
  assert.equal(trial.events.filter(e => e.type === 'trial_ended').length, 1, label);
  for (const player of trial.player2StartPosition ? [1, 2] : [1]) {
    // A chef is locked after reaching a goal. Legacy action/trajectory arrays
    // contain only that chef's moves; turn events also cover waiting steps.
    const moves = turns.filter(e => {
      if (e.actor != null) return e.actor === player;
      const position = e.stateBefore[`player${player}`];
      const locked = e.stateBefore.currentGoals.some(goal => JSON.stringify(goal) === JSON.stringify(position));
      return !!e.actions?.[player - 1] && !locked;
    });
    for (const field of ['Actions', 'Trajectory', 'RT']) assert.equal(trial[`player${player}${field}`].length, moves.length, `${label}: player${player}${field}`);
    assert.deepEqual(trial[`player${player}Trajectory`], moves.map(e => e.stateBefore[`player${player}`]), `${label}: trajectory matches events`);
    assert.deepEqual(trial[`player${player}FinalPosition`], trial.finalState[`player${player}`], label);
  }
  assert.equal(trial.dpDecisions.length, trial.player2StartPosition ? trial.totalSteps : 0, `${label}: decisions`);
  summary.push({ index: trial.trialIndex, phase: trial.trialPhase, map: trial.sourceMapId, steps: trial.totalSteps, events: trial.events.length, decisions: trial.dpDecisions.length, reason: trial.terminationReason });
}
assert.equal(rows('ExperimentData').length, 21);
assert.equal(rows('Events').length, trials.reduce((n, t) => n + t.events.length, 0));
assert.equal(rows('AgentDecisions').length, trials.reduce((n, t) => n + t.dpDecisions.length, 0));
const questions = snapshot.comprehensionCheckData.questions;
assert.equal(questions.length, 4);
assert(questions.every(q => q.finalAnswer && q.attempts === q.history.length && q.displayOrder.length === 2));
assert.equal(questions[0].attempts, 2);
assert.equal(questions[0].firstAttemptCorrect, false);
assert.equal(rows('Comprehension').length, 4);
assert.deepEqual(Object.keys(snapshot.questionnaireData).sort(), ['ai_detection', 'collaboration_rating', 'play_again']);
assert.deepEqual(JSON.parse(JSON.stringify(rows('Questionnaire')[0])), snapshot.questionnaireData);
assert(snapshot.gamesCompletedAt && snapshot.questionnaireCompletedAt);
assert.equal(snapshot.sessionStatus, 'completed');
assert.equal(snapshot.activeTrial, null);
let localBackupMatched = false;
if (process.argv[3]) {
  const local = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')).find(s => s.sessionId === snapshot.sessionId);
  assert(local, 'session exists in downloaded local backup');
  for (const field of ['allTrialsData', 'comprehensionCheckData', 'questionnaireData', 'gamesCompletedAt', 'questionnaireCompletedAt', 'assignedMapOrder', 'gameConfig', 'sessionStatus']) {
    assert.deepEqual(local[field], snapshot[field], `local/Drive: ${field}`);
  }
  localBackupMatched = true;
}
console.log(JSON.stringify({ sessionId: snapshot.sessionId, status: 'PASS', localBackupMatched, sheets: workbook.SheetNames, totalEvents: rows('Events').length, totalDecisions: rows('AgentDecisions').length, rounds: summary, comprehension: questions, questionnaire: snapshot.questionnaireData, gamesCompletedAt: snapshot.gamesCompletedAt, questionnaireCompletedAt: snapshot.questionnaireCompletedAt }, null, 2));
