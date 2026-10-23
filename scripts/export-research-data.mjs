import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Select the greatest acknowledged revision per session; older uploads are history.
export async function exportResearchData(source, destination) {
  const tables = { sessions: [], trials: [], events: [], agent_decisions: [], responses: [] };
  for (const item of await fs.readdir(source, { withFileTypes: true })) {
    if (!item.isDirectory() || !/^[a-f0-9]{32}$/.test(item.name)) continue;
    const directory = path.join(source, item.name);
    const files = (await fs.readdir(directory)).filter(f => /^\d+\.json$/.test(f)).sort((a,b) => Number(b.slice(0,-5)) - Number(a.slice(0,-5)));
    if (!files.length) continue;
    const { snapshot: session, revision, savedAt } = JSON.parse(await fs.readFile(path.join(directory, files[0]), 'utf8'));
    const { allTrialsData = [], activeTrial, comprehensionCheckData, questionnaireData, ...metadata } = session;
    tables.sessions.push({ ...metadata, revision, savedAt });
    for (const trial of [...allTrialsData, ...(activeTrial ? [activeTrial] : [])]) {
      const { events = [], dpDecisions = [], ...fields } = trial;
      const keys = { sessionId: session.sessionId, participantId: session.participantId, dyadId: session.dyadId, trialId: trial.trialId, trialIndex: trial.trialIndex, trialPhase: trial.trialPhase, currentPlayer: session.currentPlayer };
      tables.trials.push({ ...fields, ...keys });
      tables.events.push(...events.map(event => ({ ...event, ...keys })));
      tables.agent_decisions.push(...dpDecisions.map(decision => ({ ...decision, ...keys })));
    }
    for (const q of comprehensionCheckData?.questions || []) {
      tables.responses.push({ sessionId: session.sessionId, participantId: session.participantId, responseType: 'comprehension', ...q });
    }
    if (questionnaireData) tables.responses.push({ sessionId: session.sessionId, participantId: session.participantId, responseType: 'questionnaire', answers: questionnaireData });
  }
  // Require a new directory, so existing exports are never silently overwritten.
  await fs.mkdir(destination, { mode: 0o700 });
  for (const [name, rows] of Object.entries(tables)) {
    await fs.writeFile(path.join(destination, `${name}.jsonl`), rows.map(row => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''), { flag: 'wx', mode: 0o600 });
  }
  await fs.writeFile(path.join(destination, 'README.txt'), 'One JSON object per line. Latest revision per session only. Filter trials: status=ended AND trialPhase=main; exclude partner_disconnect if required. For LAN pairing use dyadId + experimentType/trialIndex; each device has its own sessionId/trialId and time origin. Do not count both devices as independent dyads. Active trials are retained and explicitly marked. Legacy RT is cumulative execution elapsed ms. Individual input timestamps do not establish synchronized cross-device reaction times. Files may contain participant contact details; store with restricted access.\n');
  return Object.fromEntries(Object.entries(tables).map(([key, rows]) => [key, rows.length]));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [source = 'research-data', destination = `research-export-${Date.now()}`] = process.argv.slice(2);
  console.log(await exportResearchData(source, destination));
}
