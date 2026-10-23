import assert from 'node:assert/strict';
import {TimelineManager} from '../client/src/timeline/TimelineManager.js';
const t=Object.create(TimelineManager.prototype);
const oldDocument=globalThis.document,oldTimeout=globalThis.setTimeout;
globalThis.document={getElementById:()=>({})};globalThis.setTimeout=()=>0;
let feedback;t.emit=(_,data)=>feedback=data;
try{
 // No solo round: completed results occupy indices 0 and 1, but IDs are 1 and 2.
 t.experimentData={experiments:{StagHunt:[{trialData:{trialIndex:1},success:true},{trialData:{trialIndex:2},success:true}]}};
 t.showPostTrialStage('StagHunt',0,2);assert.equal(feedback.success,true);
 t.experimentData.experiments.StagHunt.push({trialIndex:3,success:true},{trialIndex:4,success:false});
 t.showPostTrialStage('StagHunt',0,4);assert.equal(feedback.success,false);
 t.experimentData.experiments.StagHunt.push({trialIndex:4,success:true});
 t.showPostTrialStage('StagHunt',0,4);assert.equal(feedback.success,true,'latest retry result');
 console.log('PASS practice-only success/failure and latest retry feedback lookup.');
}finally{globalThis.document=oldDocument;globalThis.setTimeout=oldTimeout}
