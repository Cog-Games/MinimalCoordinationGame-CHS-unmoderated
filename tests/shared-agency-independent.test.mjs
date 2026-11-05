import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';
import {CONFIG,GameConfigUtils} from '../client/src/config/gameConfig.js';
import {SharedAgencyAgent,SA_PARAMETERS,seededRandom} from '../client/src/ai/SharedAgencyAgent.js';
import {SAAgent,DP_ACTIONS} from '../client/src/ai/SharedAgencyCore.js';
import {ExperimentManager} from '../client/src/experiments/ExperimentManager.js';
import {GameStateManager} from '../client/src/game/GameStateManager.js';
import {MapLoader} from '../client/src/utils/MapLoader.js';
import {StagHuntMaps} from '../client/src/data/StagHuntMaps.js';
import {snapshotWorkbook} from '../client/src/data/GoogleDriveTransport.js';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);const names=['left','right','up','down'];
const loader=Object.create(MapLoader.prototype),trials=[];
assert.equal(CONFIG.game.players.player2.type,'sa');assert.equal(CONFIG.multiplayer.fallbackAIType,'sa');
GameConfigUtils.setPlayerType(2,'rl_joint');assert.equal(CONFIG.game.studyRLCondition,'joint');GameConfigUtils.setPlayerType(2,'sa');assert.equal(CONFIG.game.studyRLCondition,'shared-agency');
const log=console.log;console.log=()=>{};
function humanMove(g,target){const st=g.currentState,p=st.player1;if(st.currentGoals.some(q=>eq(q,p)))return null;const queue=[[p,null]],seen=new Set([String(p)]);for(let i=0;i<queue.length;i++){const [q,first]=queue[i];if(eq(q,target))return names[first];for(let a=0;a<4;a++){const x=q.map((v,k)=>v+DP_ACTIONS[a][k]);if(x.some(v=>v<0||v>=9)||st.gridMatrix[x[0]][x[1]]===4||seen.has(String(x)))continue;if(st.currentGoals.some(z=>eq(z,x))&&!eq(x,target))continue;seen.add(String(x));queue.push([x,first??a]);}}throw Error('No human path');}
const g=new GameStateManager();const ctl=Object.create(ExperimentManager.prototype);ctl.gameStateManager=g;ctl.aiPlayerNumber=2;ctl.sharedAgencyAgent=new SharedAgencyAgent();g.onAgentTurnCommitted=(b,a,t,td)=>ctl.sharedAgencyAgent.observeTurn(b,a,t,td);
try {
 for(let i=1;i<=20;i++){
  const practice=i<=4,map=StagHuntMaps[String(practice?[1,5,3,9][i-1]:i-4)][0];g.initializeTrial(practice?i:i,'StagHunt',loader.normalizeStagHuntMap(map));
  const script=practice?CONFIG.game.experiments.stagHuntScriptedRounds[i-1]:null;const target=(script?script.human==='big':i%2===0)?map.stag:map.rabbits.reduce((best,p)=>Math.abs(p[0]-map.red[0])+Math.abs(p[1]-map.red[1])<Math.abs(best[0]-map.red[0])+Math.abs(best[1]-map.red[1])?p:best);
  let reference,rr;
  for(let step=0;step<60;step++){
   const state=g.getCurrentState();const human=humanMove(g,target);let result;
   if(human===null){
     ctl.rlAgent={};ctl.uiManager={updateGameDisplay(){}};ctl.handleTrialComplete=()=>{};
     const before=g.stepCount;await ctl.makeAIMove();
     assert.equal(g.stepCount,before+1,`independent stalled map ${i} at ${JSON.stringify(state.player2)}`);
     result={trialComplete:g.checkTrialCompletion()};
   }else {
     const delta=ctl.getPlannerAction(state);const ai=delta?names[DP_ACTIONS.findIndex(d=>eq(d,delta))]:null;
     result=g.processSynchronizedMoves(human,ai);assert(result.success);
   }
   g.isMoving=false;
   if(result.trialComplete)break;
  }
  assert(g.checkTrialCompletion());g.finalizeTrial(true);
  assert(g.trialData.completed || g.trialData.status==='ended');
  if(practice){assert.equal(g.trialData.effectiveAgentPolicy,'scripted-practice');assert(!g.trialData.agentModel);}
  else {assert.equal(g.trialData.partnerAgentType,'shared-agency');assert.equal(g.trialData.saBeliefUpdates.length,g.stepCount);assert.equal(g.trialData.dpDecisions.length,g.stepCount);assert.equal(g.trialData.agentModel.pSignal,.75);}
  trials.push(g.getCurrentTrialData());
 }
 const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('client/public/vendor/xlsx.full.min.js','utf8'),ctx);const XLSX=ctx.XLSX;
 const payload={sessionId:'sa-release-test',participantIndex:'SA_TEST',timestamp:new Date().toISOString(),gameConfig:CONFIG.game,allTrialsData:trials,questionnaireData:{},comprehensionCheckData:{questions:[]}};
 const bytes=Buffer.from(snapshotWorkbook({sessionId:payload.sessionId,revision:1,snapshot:payload},XLSX),'base64');const saved=XLSX.read(bytes,{type:'buffer'});
 assert.equal(XLSX.utils.sheet_to_json(saved.Sheets.AgentDecisions).length,trials.reduce((n,t)=>n+t.dpDecisions.length,0));assert.equal(XLSX.utils.sheet_to_json(saved.Sheets.SABeliefUpdates).length,trials.reduce((n,t)=>n+(t.saBeliefUpdates?.length||0),0));
 const raw=JSON.parse(Buffer.from(XLSX.utils.sheet_to_json(saved.Sheets.RawJSON,{header:1}).slice(1).map(r=>r[1]).join(''),'base64').toString());assert.deepEqual(raw.allTrialsData.at(-1).agentModel,trials.at(-1).agentModel);assert.deepEqual(raw.allTrialsData.at(-1).dpDecisions,trials.at(-1).dpDecisions);
 fs.mkdirSync('/tmp/sa-release-verification',{recursive:true});fs.writeFileSync('/tmp/sa-release-verification/sa-release-test.xlsx',bytes);fs.writeFileSync('/tmp/sa-release-verification/snapshot.json',JSON.stringify(payload));
}finally{console.log=log;}
console.log('PASS: consecutive rounds on one game instance; independent AI continuation after human goal; complete per-round decision/belief exports.');
