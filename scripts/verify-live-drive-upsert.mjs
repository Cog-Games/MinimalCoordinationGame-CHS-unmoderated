// Explicit opt-in live test. Uploads a copy of the synthetic validation session,
// under a fresh test identity, never a real participant record.
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { googleDriveFetch } from '../client/src/data/GoogleDriveTransport.js';

if (!process.argv.includes('--live')) throw new Error('Pass --live to upload test data');
const output = 'output/session-upsert-validation';
fs.mkdirSync(output, { recursive:true });
const c={};vm.createContext(c);vm.runInContext(fs.readFileSync('client/public/vendor/xlsx.full.min.js','utf8'),c);
const wb=c.XLSX.read(fs.readFileSync('output/full-session-validation/drive-final.xlsx'),{type:'buffer'});
const raw=c.XLSX.utils.sheet_to_json(wb.Sheets.RawJSON,{header:1}).slice(1);
const fixture=JSON.parse(Buffer.from(raw.map(r=>r[1]).join(''),'base64').toString());
assert.equal(fixture.sessionId,'7f4cc5dcef63277e5d7742036c3030ae','use only the previously generated synthetic session');
const sessionId=crypto.randomBytes(16).toString('hex');
const writeToken=crypto.randomBytes(16).toString('hex');
const endpoint=fs.readFileSync('client/src/config/gameConfig.js','utf8').match(/https:\/\/script.google.com\/macros\/s\/[A-Za-z0-9_-]{20,}\/exec/)[0];
fixture.sessionId=sessionId;
fixture.participantId='TEST-session-upsert-'+sessionId.slice(0,8);
fixture.validationOnly=true;
for(const t of fixture.allTrialsData) {t.sessionId=sessionId;t.trialId=crypto.randomBytes(16).toString('hex');}
const acknowledgements=[];
const transport=googleDriveFetch({XLSX:()=>c.XLSX,fetchImpl:async(...args)=>{
  const response=await fetch(...args);
  if(args[1]?.method==='POST') acknowledgements.push(await response.clone().json());
  return response;
}});
const stages=[
  {revision:1,snapshot:{...fixture,sessionStatus:'in_progress',saveCheckpoint:'session_started',allTrialsData:[],questionnaireData:null,comprehensionCheckData:null,gamesCompletedAt:null,questionnaireCompletedAt:null}},
  {revision:2,snapshot:{...fixture,sessionStatus:'in_progress',saveCheckpoint:'trial_complete',allTrialsData:fixture.allTrialsData.slice(0,5),questionnaireData:null,gamesCompletedAt:null,questionnaireCompletedAt:null}},
  {revision:3,snapshot:{...fixture,sessionStatus:'completed',saveCheckpoint:'questionnaire_complete'}}
];
for(const stage of [stages[0],stages[1],stages[1],stages[2],stages[0]]) {
  const response=await transport(endpoint,{body:JSON.stringify({sessionId,writeToken,...stage}),signal:AbortSignal.timeout(45000)});
  const ack=await response.json();assert.equal(ack.saved,true);
  console.log(JSON.stringify({revision:stage.revision,fileId:ack.fileId}));
}
assert.equal(new Set(acknowledgements.map(a=>a.fileId)).size,1);
assert.deepEqual(acknowledgements.map(a=>a.disposition),['created','updated','unchanged','updated','superseded']);
assert.equal(acknowledgements.at(-1).storedRevision,3);
const report={sessionId,fileId:acknowledgements[0].fileId,filename:`cake_${sessionId}.xlsx`,acknowledgements};
fs.writeFileSync(`${output}/live-upsert.json`,JSON.stringify(report,null,2));
fs.writeFileSync(`${output}/expected-final.json`,JSON.stringify(stages[2].snapshot));
console.log('PASS: create, intermediate update, duplicate retry, final update, stale retry all reference one file ID.');
