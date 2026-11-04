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
try {
 for(let i=1;i<=20;i++){
  const practice=i<=4,map=StagHuntMaps[String(practice?[1,5,3,9][i-1]:i-4)][0];const g=new GameStateManager();g.initializeTrial(practice?i:i,'StagHunt',loader.normalizeStagHuntMap(map));
  const ctl=Object.create(ExperimentManager.prototype);ctl.gameStateManager=g;ctl.aiPlayerNumber=2;ctl.sharedAgencyAgent=new SharedAgencyAgent();g.onAgentTurnCommitted=(b,a,t,td)=>ctl.sharedAgencyAgent.observeTurn(b,a,t,td);
  const script=practice?CONFIG.game.experiments.stagHuntScriptedRounds[i-1]:null;const target=(script?script.human==='big':i%2===0)?map.stag:map.rabbits.reduce((best,p)=>Math.abs(p[0]-map.red[0])+Math.abs(p[1]-map.red[1])<Math.abs(best[0]-map.red[0])+Math.abs(best[1]-map.red[1])?p:best);
  let reference,rr;
  for(let step=0;step<60;step++){
   const state=g.getCurrentState();const delta=ctl.getPlannerAction(state);const rec=g.trialData.dpDecisions.at(-1);
   if(!practice){
    if(!reference){reference=new SAAgent(ctl.sharedAgencyAgent.model,1,SA_PARAMETERS);rr=seededRandom(g.trialData.agentModel.seed);}
    const expected=reference.decide([state.player1,state.player2],60-step,rr);assert.equal(rec.action,expected.action);assert.deepEqual(rec.beliefBefore,reference.belief);assert.equal(rec.type,'sa_decision');
   }else assert.equal(rec.policy,'scripted');
   const ai=delta?names[DP_ACTIONS.findIndex(d=>eq(d,delta))]:null;
   const human=humanMove(g,target);const result=g.processSynchronizedMoves(human,ai);assert(result.success);g.isMoving=false;
   if(!practice){const actions=rec.observedActions;assert(actions);reference.observe([state.player1,state.player2],actions,60-step);assert.deepEqual(rec.beliefAfter,reference.belief);}
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
console.log('PASS: four scripted practice rounds, all 16 main maps, exact core-policy/seed parity, posterior updates after committed turns including final turn, trial reset, model identity and XLSX round trip for decisions/beliefs/metadata.');
