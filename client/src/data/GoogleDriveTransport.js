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

export function sessionFilenameLabel(snapshot) {
  return String(snapshot.participantIndex || snapshot.parentEmail || '').trim()
    .replace(/[^A-Za-z0-9@._+-]/g, '_').slice(0, 254);
}

export function googleDriveFetch({ XLSX = () => window.XLSX, fetchImpl = (...args) => fetch(...args) } = {}) {
  const ready = new Set();
  return async (endpoint, options) => {
    if (!endpoint.startsWith('https://script.google.com/macros/s/')) return fetchImpl(endpoint, options);
    // Check before POSTing: an older deployment would silently create duplicates.
    if (!ready.has(endpoint)) {
      const check = await fetchImpl(endpoint, { method:'GET', mode:'cors', credentials:'omit', signal:options.signal });
      const capability = check.ok ? await check.json() : null;
      if (capability?.protocol !== 'cake-session-upsert-v1') throw new Error('Google Drive save service needs the session-update deployment; data remains backed up locally');
      ready.add(endpoint);
    }
    const record = JSON.parse(options.body);
    const filenameLabel = sessionFilenameLabel(record.snapshot);
    const filename = `cake_${filenameLabel ? filenameLabel + '_' : ''}${record.sessionId}.xlsx`;
    const body = new URLSearchParams({ protocol:'cake-session-upsert-v1', filename, filenameLabel, filedata:snapshotWorkbook(record, XLSX()), filetype:'excel', sessionId:record.sessionId,
      revision:String(record.revision), writeToken:record.writeToken, sessionStatus:record.snapshot.sessionStatus,
      snapshotReason:record.snapshot.saveCheckpoint || '' });
    const response = await fetchImpl(endpoint, { method:'POST', mode:'cors', body, signal:options.signal, credentials:'omit' });
    if (!response.ok) throw new Error(`Google Drive returned HTTP ${response.status}`);
    const ack = await response.json();
    if (ack.status !== 'success' || ack.protocol !== 'cake-session-upsert-v1' || ack.sessionId !== record.sessionId ||
        ack.revision !== record.revision || !Number.isSafeInteger(ack.storedRevision) || ack.storedRevision < record.revision ||
        (ack.fileName !== filename && !(ack.storedRevision > record.revision && typeof ack.fileName === 'string' && ack.fileName.startsWith('cake_') && ack.fileName.endsWith(`_${record.sessionId}.xlsx`))) || typeof ack.fileId !== 'string' || !ack.fileId) throw new Error('Google Drive did not confirm this session revision');
    return { ok:true, json:async () => ({ saved:true, sessionId:record.sessionId, revision:record.revision, savedAt:new Date().toISOString(), fileId:ack.fileId, fileName:ack.fileName }) };
  };
}
