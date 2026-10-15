// Shared with the original experiment export: preserve worksheet names and column order.
export function experimentWorkbook(exportObj, XLSX) {
const CONFIG = { game: exportObj.gameConfig || {} };
const gsData = exportObj;
const GameConfigUtils = { isTwoPlayerExperiment: type => /2P|^STAGHUNT/i.test(String(type || '')) };
const wb = XLSX.utils.book_new();

// Process trial data into a flat table (include roomId as an extra column)
const trials = exportObj.allTrialsData || [];
if (trials.length > 0) {
  // Normalize rows to a stable header set to prevent column mismatches
  const processed = trials.map(t => {
    const o = {};
    for (const k in t) {
      if (k === 'events' || k === 'dpDecisions') continue; // One event per row below.
      const v = t[k];
      // Flatten arrays/objects for Excel cells
      o[k] = (Array.isArray(v) || (v && typeof v === 'object')) ? JSON.stringify(v) : v;
    }
    // Add roomId column to each row (explicit)
    o.roomId = exportObj.roomId || '';
    // Add participantId per row for easier analysis join
    o.participantId = exportObj.participantId;
    o.saveCheckpoint = exportObj.saveCheckpoint || '';
    o.saveCheckpointTime = exportObj.saveCheckpointTime || '';
    // Lookit join keys from exp-lookit-iframe query parameters
    o.lookitResponseId = exportObj.lookitResponseId || '';
    o.lookitChildId = exportObj.lookitChildId || '';
    o.participantDob = exportObj.participantDob || '';
    o.participantAgeReferenceDate = exportObj.participantAgeReferenceDate || '';
    o.participantAgeYears = exportObj.participantAgeYears ?? '';
    o.participantAgeMonths = exportObj.participantAgeMonths ?? '';
    o.participantAgeDays = exportObj.participantAgeDays ?? '';
    o.participantAgeTotalDays = exportObj.participantAgeTotalDays ?? '';
    o.participantIndex = exportObj.participantIndex || '';
    o.studySetting = exportObj.studySetting || 'remote';
    o.parentEmail = exportObj.parentEmail || '';
    o.parentEmailUse = exportObj.parentEmailUse || '';
    // Add current player number (1 or 2) for human-human mode analysis
    o.currentPlayer = exportObj.currentPlayer ?? null;
    // Legacy naming: prefer distanceCondition in exports
    if (o.newGoalConditionType && !o.distanceCondition) {
      o.distanceCondition = o.newGoalConditionType;
    }
    // Drop non-legacy alias from export to avoid confusion
    delete o.newGoalConditionType;
    return o;
  });

  // Build a stable union of all keys across rows
  const headerSet = new Set();
  processed.forEach(row => Object.keys(row).forEach(k => headerSet.add(k)));

  // Prefer a sensible column order for readability; include common fields first if present
  const preferredOrder = [
    'trialIndex', 'experimentType', 'partnerAgentType',
    'currentPlayer', 'participantId', 'lookitResponseId', 'lookitChildId', 'roomId',
    'saveCheckpoint', 'saveCheckpointTime',
    'participantIndex', 'studySetting', 'parentEmail', 'parentEmailUse',
    'participantDob', 'participantAgeReferenceDate',
    'participantAgeYears', 'participantAgeMonths', 'participantAgeDays', 'participantAgeTotalDays',
    'humanPlayerIndex', 'aiPlayerIndex',
    'player1StartPosition', 'player2StartPosition', 'initialGoalPositions',
    'partnerFallbackOccurred', 'partnerFallbackReason', 'partnerFallbackStage', 'partnerFallbackTime',
    'partnerFallbackAIType',
    'collaborationSucceeded',
    'player1GoalReachedStep', 'player2GoalReachedStep',
    'newGoalPresented', 'newGoalPosition', 'distanceCondition', 'isNewGoalCloserToPlayer2',
    'trialStartTime', 'gptErrorEvents', 'currentPlayerIndex',
    'player1Trajectory', 'player2Trajectory', 'player1Actions', 'player2Actions', 'player1RT', 'player2RT',
    'player1CurrentGoal', 'player2CurrentGoal', 'player1FirstDetectedGoal', 'player2FirstDetectedGoal',
    'player1FinalReachedGoal', 'player2FinalReachedGoal', 'firstDetectedSharedGoal'
  ];
  const headers = [];
  // Add preferred keys that exist
  preferredOrder.forEach(k => { if (headerSet.has(k)) { headers.push(k); headerSet.delete(k); } });
  // Append any remaining keys in alphabetical order for determinism
  headers.push(...Array.from(headerSet).sort());

  // Map row values by header order to avoid misaligned columns
  const wsData = [
    headers,
    ...processed.map(row => headers.map(h => (h in row) ? row[h] : ''))
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'ExperimentData');
} else {
  const ws = XLSX.utils.aoa_to_sheet([["No experimental data available"], [exportObj.timestamp || '']]);
  XLSX.utils.book_append_sheet(wb, ws, 'ExperimentData');
}

for (const [field, sheetName] of [['events', 'Events'], ['dpDecisions', 'AgentDecisions']]) {
  const rows = [['sessionId', 'trialId', 'trialIndex', 'turnId', 'type', 'at', 'elapsedMs', 'payload']];
  for (const trial of trials) {
    for (const event of trial[field] || []) {
      rows.push([exportObj.sessionId, trial.trialId, trial.trialIndex, event.turnId ?? event.step,
        event.type || 'dp_decision', event.at ?? '', event.elapsedMs ?? '', JSON.stringify(event)]);
    }
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), sheetName);
}

// Meta sheet
// Determine partner agent type summary for meta
const p2Type = (CONFIG?.game?.players?.player2?.type) || '';
const partnerAgentType = (function(){
  const p1Type = (CONFIG?.game?.players?.player1?.type);
  const p2Type = (CONFIG?.game?.players?.player2?.type);
  const t = (p1Type !== 'human') ? p1Type : ((p2Type !== 'human') ? p2Type : 'human');
  if (t === 'human') return 'human';
  if (t === 'gpt') {
    const model = (CONFIG?.game?.agent?.gpt?.model);
    if (model && String(model).trim().length > 0) {
      return String(model);
    } else {
      console.warn('⚠️ GPT model not cached in CONFIG for export, using configured default');
      return 'gpt-4o'; // matches the configured GPT_MODEL in .env
    }
  }
  if (t === 'rl_joint') return 'joint-rl';
  if (t === 'rl_individual') return 'individual-rl';
  if (t === 'ai') return (CONFIG?.game?.agent?.type === 'individual') ? 'individual-rl' : 'joint-rl'; // legacy safety
  return t || 'unknown';
})();

const fallbackEvents = (gsData && Array.isArray(gsData.fallbackEvents)) ? gsData.fallbackEvents : [];

// Calculate collaboration success statistics
const allTrials = exportObj.allTrialsData || [];
const collaborationTrials = allTrials.filter(trial =>
  trial.experimentType && GameConfigUtils.isTwoPlayerExperiment(trial.experimentType) &&
  trial.trialPhase === 'main' && !!trial.player2StartPosition
);
const collaborationSuccessCount = collaborationTrials.filter(trial =>
  trial.collaborationSucceeded === true
).length;
const collaborationSuccessRate = collaborationTrials.length > 0
  ? Math.round((collaborationSuccessCount / collaborationTrials.length) * 100)
  : 0;

const metaRows = [
  ['sessionId', exportObj.sessionId],
  ['dyadId', exportObj.dyadId || ''],
  ['dataSchemaVersion', exportObj.dataSchemaVersion],
  ['build', JSON.stringify(exportObj.build)],
  ['cupcakeWidgetRedOnRight', exportObj.cupcakeWidgetRedOnRight],
  ['participantId', exportObj.participantId],
  ['lookitResponseId', exportObj.lookitResponseId || ''],
  ['lookitChildId', exportObj.lookitChildId || ''],
  ['saveCheckpoint', exportObj.saveCheckpoint || ''],
  ['saveCheckpointTime', exportObj.saveCheckpointTime || ''],
  ['dataSaveCheckpointTimes', JSON.stringify(exportObj.dataSaveCheckpointTimes || {})],
  ['participantIndex', exportObj.participantIndex || ''],
  ['studySetting', exportObj.studySetting || 'remote'],
  ['parentEmail', exportObj.parentEmail || ''],
  ['parentEmailUse', exportObj.parentEmailUse || ''],
  ['participantDob', exportObj.participantDob || ''],
  ['participantAgeReferenceDate', exportObj.participantAgeReferenceDate || ''],
  ['participantAgeYears', exportObj.participantAgeYears ?? ''],
  ['participantAgeMonths', exportObj.participantAgeMonths ?? ''],
  ['participantAgeDays', exportObj.participantAgeDays ?? ''],
  ['participantAgeTotalDays', exportObj.participantAgeTotalDays ?? ''],
  ['roomId', exportObj.roomId || ''],
  ['experimentOrder', JSON.stringify(exportObj.experimentOrder || [])],
  ['experimentType', exportObj.experimentType],
  ['partnerAgentType', partnerAgentType],
  ['fallbackEventCount', fallbackEvents.length],
  ['fallbackEvents', JSON.stringify(fallbackEvents)],
  ['waitingDuration', exportObj.waitingDuration || 0],
  ['waitingDetails', JSON.stringify(exportObj.waitingDetails || [])],
  ['gamesCompletedAt', exportObj.gamesCompletedAt || ''],
  ['questionnaireCompletedAt', exportObj.questionnaireCompletedAt || ''],
  ['collaborationTrialsTotal', collaborationTrials.length],
  ['collaborationSuccessCount', collaborationSuccessCount],
  ['collaborationSuccessRate', collaborationSuccessRate],
  ['version', exportObj.version],
  ['timestamp', exportObj.timestamp]
];
const metaSheet = XLSX.utils.aoa_to_sheet(metaRows);
XLSX.utils.book_append_sheet(wb, metaSheet, 'Meta');

const participantInfoRows = [
  ['Field', 'Value'],
  ['participantId', exportObj.participantId],
  ['lookitResponseId', exportObj.lookitResponseId || ''],
  ['lookitChildId', exportObj.lookitChildId || ''],
  ['saveCheckpoint', exportObj.saveCheckpoint || ''],
  ['saveCheckpointTime', exportObj.saveCheckpointTime || ''],
  ['participantIndex', exportObj.participantIndex || ''],
  ['studySetting', exportObj.studySetting || 'remote'],
  ['parentEmail', exportObj.parentEmail || ''],
  ['parentEmailUse', exportObj.parentEmailUse || ''],
  ['participantDob', exportObj.participantDob || ''],
  ['participantAgeReferenceDate', exportObj.participantAgeReferenceDate || ''],
  ['participantAgeYears', exportObj.participantAgeYears ?? ''],
  ['participantAgeMonths', exportObj.participantAgeMonths ?? ''],
  ['participantAgeDays', exportObj.participantAgeDays ?? ''],
  ['participantAgeTotalDays', exportObj.participantAgeTotalDays ?? ''],
  ['gamesCompletedAt', exportObj.gamesCompletedAt || ''],
  ['questionnaireCompletedAt', exportObj.questionnaireCompletedAt || '']
];
const participantInfoSheet = XLSX.utils.aoa_to_sheet(participantInfoRows);
XLSX.utils.book_append_sheet(wb, participantInfoSheet, 'ParticipantInfo');

// Collaboration Summary sheet
const collaborationSummaryRows = [
  ['Metric', 'Value'],
  ['Total Collaboration Trials', collaborationTrials.length],
  ['Collaboration Successes', collaborationSuccessCount],
  ['Collaboration Failures', collaborationTrials.length - collaborationSuccessCount],
  ['Collaboration Success Rate (%)', collaborationSuccessRate],
  ['', ''], // Empty row for spacing
  ['Experiment Type', 'Success Count', 'Total Trials', 'Success Rate (%)']
];

// Add per-experiment-type breakdown
const experimentTypes = [...new Set(collaborationTrials.map(t => t.experimentType))];
experimentTypes.forEach(expType => {
  const expTrials = collaborationTrials.filter(t => t.experimentType === expType);
  const expSuccesses = expTrials.filter(t => t.collaborationSucceeded === true).length;
  const expRate = expTrials.length > 0 ? Math.round((expSuccesses / expTrials.length) * 100) : 0;
  collaborationSummaryRows.push([expType, expSuccesses, expTrials.length, expRate]);
});

const collaborationSheet = XLSX.utils.aoa_to_sheet(collaborationSummaryRows);
XLSX.utils.book_append_sheet(wb, collaborationSheet, 'CollaborationSummary');

// Questionnaire sheet
const q = exportObj.questionnaireData || exportObj.questionnaire || {};
let qSheet;
if (q && typeof q === 'object' && !Array.isArray(q)) {
  const headers = Object.keys(q);
  const values = headers.map(h => q[h]);
  qSheet = XLSX.utils.aoa_to_sheet([headers, values]);
} else if (Array.isArray(q)) {
  qSheet = XLSX.utils.aoa_to_sheet(q);
} else {
  qSheet = XLSX.utils.aoa_to_sheet([["Questionnaire"], [JSON.stringify(q)]]);
}
XLSX.utils.book_append_sheet(wb, qSheet, 'Questionnaire');

XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
  ['Question', 'Attempts', 'FirstAttemptCorrect', 'FinalAnswer', 'History', 'DisplayOrder'],
  ...(exportObj.comprehensionCheckData?.questions || []).map(q => [q.name, q.attempts, q.firstAttemptCorrect, q.finalAnswer, JSON.stringify(q.history || []), JSON.stringify(q.displayOrder || [])])
]), 'Comprehension');
const { allTrialsData: _trials, activeTrial: _active, ...sessionMetadata } = exportObj;
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(
  Object.entries(sessionMetadata).map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value])
), 'SessionMetadata');

// Excel limits cell strings to 32767 characters. Preserve long fields in numbered
// chunks instead of failing the entire upload or silently truncating research data.
const overflow = [['sheet', 'cell', 'chunkIndex', 'text']];
for (const name of wb.SheetNames) {
  for (const [address, cell] of Object.entries(wb.Sheets[name])) {
    if (address.startsWith('!') || typeof cell.v !== 'string' || cell.v.length <= 32000) continue;
    const value = cell.v;
    for (let offset = 0; offset < value.length; offset += 24000) overflow.push([name, address, offset / 24000, value.slice(offset, offset + 24000)]);
    cell.v = `[Full value in Overflow: ${name}!${address}]`;
    delete cell.w;
  }
}
if (overflow.length > 1) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overflow), 'Overflow');
return wb;
}
