import assert from 'node:assert/strict';
import {CakeVisualization} from '../client/src/ui/CakeVisualization.js';
import {TimelineManager} from '../client/src/timeline/TimelineManager.js';
const original={Audio:globalThis.Audio,document:globalThis.document};
class FakeAudio extends EventTarget{play(){return Promise.resolve()} pause(){}}
globalThis.Audio=FakeAudio;globalThis.document={getElementById:()=>({})};
try {
 const cake=Object.create(CakeVisualization.prototype);
 const done=cake.playVoiceLine('Aw no cupcakes.mp4');let ended=false;done.then(()=>ended=true);
 await Promise.resolve();assert.equal(ended,false);
 const t=Object.create(TimelineManager.prototype);t.currentStageIndex=3;
 t.experimentData={experiments:{StagHunt:[{trialIndex:4,success:false}]}};
 t.emit=(_,data)=>data.feedbackFinished=done;let advances=0;t.nextStage=()=>advances++;
 t.showPostTrialStage('StagHunt',0,4);
 await new Promise(r=>setTimeout(r,2100));assert.equal(advances,0,'must not advance at old 2-second cutoff');
 cake.currentVoiceAudio.dispatchEvent(new Event('ended'));await done;await Promise.resolve();assert.equal(advances,1);
 const failed=cake.playVoiceLine('missing');cake.currentVoiceAudio.dispatchEvent(new Event('error'));await failed;
 globalThis.Audio=class extends FakeAudio{play(){return Promise.reject(new Error('blocked'))}};
 await cake.playVoiceLine('blocked');
 console.log('PASS feedback waits past 2 seconds for audio ended; load and autoplay failures release wait.');
}finally{globalThis.Audio=original.Audio;globalThis.document=original.document}
