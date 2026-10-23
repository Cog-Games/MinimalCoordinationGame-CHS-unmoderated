import assert from 'node:assert/strict';
import {ExperimentManager} from '../client/src/experiments/ExperimentManager.js';
import {StagHuntMaps} from '../client/src/data/StagHuntMaps.js';
import {CONFIG,GameConfigUtils} from '../client/src/config/gameConfig.js';
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const em=Object.create(ExperimentManager.prototype);em.gameStateManager={stepCount:0};
for(const id of Object.keys(StagHuntMaps))for(const path of ['clear-stag','ambiguous-stag']){
 const m=StagHuntMaps[id][0],gs={gridMatrix:m.ascii.map(r=>[...r].map(c=>c==='#'?4:0)),currentGoals:[m.stag,...m.rabbits],currentGoalTypes:['big','small','small']};
 const td={};let pos=[...m.orange],seen=new Set([pos.join(',')]),moves=[];
 for(let t=0;t<40&&!eq(pos,m.stag);t++){
  em.gameStateManager.stepCount=t;
  const a=em.getScriptedAction(gs,pos,'big',td,path);assert(a,'must reach Stag');moves.push(a);
  pos=pos.map((v,i)=>v+a[i]);assert.equal(gs.gridMatrix[pos[0]][pos[1]],0);
  assert(!m.rabbits.some(g=>eq(g,pos)));assert(!seen.has(pos.join(',')),'no reversal or loop');seen.add(pos.join(','));
 }
 assert(eq(pos,m.stag));
 let corner=[0,0],clear=[0,1];while(!eq(corner,m.orange)){corner=[corner[1],8-corner[0]];clear=[clear[1],-clear[0]];}
 assert.equal(eq(moves[0],clear),path==='clear-stag');
 assert(td.dpDecisions.every(d=>d.pathType===path));
 assert.equal(em.getScriptedAction(gs,pos,'big',td,path),null);
}
assert.equal(GameConfigUtils.getStagHuntScriptedRound('StagHunt',2).partnerPath,'clear-stag');
assert.equal(GameConfigUtils.getStagHuntScriptedRound('StagHunt',3).partnerPath,'ambiguous-stag');
for(let i=5;i<21;i++)assert.equal(GameConfigUtils.getStagHuntScriptedRound('StagHunt',i),null);
console.log('PASS both scripted Stag routes on all 16 maps, legal paths, no Hare crossing/loops, logged route type, and no scripting in main trials.');

// Exercise the actual planner entry point and real per-trial state lifecycle.
// getCurrentTrialData() returns a copy, so testing getScriptedAction alone
// cannot detect lost scalar/array assignments between actual game moves.
const {GameStateManager}=await import('../client/src/game/GameStateManager.js');
const {MapLoader}=await import('../client/src/utils/MapLoader.js');
const loader=Object.create(MapLoader.prototype),maps=loader.processMapData(StagHuntMaps);
const manager=Object.create(ExperimentManager.prototype);
manager.aiPlayerNumber=2;manager.gameStateManager=new GameStateManager();
for(const [round,id] of [[1,1],[2,5],[3,3],[4,9],[2,5]]){
 const gsm=manager.gameStateManager;gsm.initializeTrial(round,'StagHunt',maps[String(id)][0]);
 assert.equal(gsm.trialData.scriptedRouteStart,null);assert.equal(gsm.trialData.scriptedPartnerTarget,null);
 const state=gsm.currentState,script=GameConfigUtils.getStagHuntScriptedRound('StagHunt',round),start=[...state.player2];
 let moves=0;
 for(;moves<40;moves++){
  const a=manager.getPlannerAction(state);if(!a)break;
  state.player2=state.player2.map((v,i)=>v+a[i]);gsm.stepCount++;
  assert.notEqual(state.gridMatrix[state.player2[0]][state.player2[1]],4);
 }
 assert(moves>1&&moves<40);
 const targetIndex=state.currentGoals.findIndex(g=>eq(g,state.player2));assert(targetIndex>=0);
 assert.equal(state.currentGoalTypes[targetIndex],script.partner);
 assert(eq(gsm.getCurrentTrialData().scriptedPartnerTarget,state.player2));
 if(script.partnerPath)assert(eq(gsm.getCurrentTrialData().scriptedRouteStart,start));
 assert.equal(gsm.trialData.dpDecisions.length,moves+1);
 console.log(`PASS real planner round ${round}: ${moves} moves to ${script.partner}`);
}
