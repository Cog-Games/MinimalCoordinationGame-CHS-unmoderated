import { experimentWorkbook } from './ExperimentWorkbook.js';
// The existing Apps Script saves Excel files and returns their Drive IDs.
// Keep the complete snapshot in lossless, bounded base64 chunks inside the workbook.
export function snapshotWorkbook(record, XLSX) {
  if (!XLSX) throw new Error('Excel exporter is unavailable');
  const s = record.snapshot;
  const wb = experimentWorkbook(s, XLSX);
  const add = (name, rows) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name);
  add('Session', [['sessionId', record.sessionId], ['revision', record.revision], ['schema', s.dataSchemaVersion], ['checkpoint', s.saveCheckpoint], ['status', s.sessionStatus], ['commit', s.build?.commit], ['sourceHash', s.build?.sourceHash], ['cupcakeWidgetRedOnRight', s.cupcakeWidgetRedOnRight], ['rawEncoding', 'UTF-8 JSON encoded as base64; concatenate RawJSON column B in row order and decode']]);
  add('Trials', [['trialIndex','trialId','phase','status','terminationReason','steps','player1Reward','player2Reward'], ...(s.allTrialsData || []).map(t => [t.trialIndex,t.trialId,t.trialPhase,t.status,t.terminationReason,t.totalSteps,t.player1Reward,t.player2Reward])]);
  const bytes = new TextEncoder().encode(JSON.stringify(s));
  let binary = '';
  for (let i=0;i<bytes.length;i+=8192) binary += String.fromCharCode(...bytes.subarray(i,i+8192));
  const encoded = btoa(binary);
  const chunks = [['chunkIndex','base64']];
  for (let i=0;i<encoded.length;i+=24000) chunks.push([i/24000, encoded.slice(i,i+24000)]);
  add('RawJSON', chunks);
  return XLSX.write(wb, { bookType:'xlsx', type:'base64', compression:true });
}

export function googleDriveFetch({ XLSX = () => window.XLSX, fetchImpl = (...args) => fetch(...args) } = {}) {
  return async (endpoint, options) => {
    if (!endpoint.startsWith('https://script.google.com/macros/s/')) return fetchImpl(endpoint, options);
    const record = JSON.parse(options.body);
    const filename = `cake_${record.sessionId}_r${String(record.revision).padStart(9,'0')}.xlsx`;
    const body = new URLSearchParams({ filename, filedata:snapshotWorkbook(record, XLSX()), filetype:'excel', sessionId:record.sessionId, snapshotReason:record.snapshot.saveCheckpoint || '' });
    const response = await fetchImpl(endpoint, { method:'POST', mode:'cors', body, signal:options.signal, credentials:'omit' });
    if (!response.ok) throw new Error(`Google Drive returned HTTP ${response.status}`);
    const ack = await response.json();
    if (ack.status !== 'success' || ack.fileName !== filename || typeof ack.fileId !== 'string' || !ack.fileId) throw new Error('Google Drive did not confirm this file');
    return { ok:true, json:async () => ({ saved:true, sessionId:record.sessionId, revision:record.revision, savedAt:new Date().toISOString(), fileId:ack.fileId, fileName:ack.fileName }) };
  };
}
