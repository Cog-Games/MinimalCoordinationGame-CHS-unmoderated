import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {StagHuntMaps} from '../client/src/data/StagHuntMaps.js';
import {DiscountedJointDP,DP_ACTIONS} from '../client/src/ai/DiscountedJointDP.js';
import {CONFIG,GameConfigUtils} from '../client/src/config/gameConfig.js';
import {MapLoader} from '../client/src/utils/MapLoader.js';
import {GameStateManager} from '../client/src/game/GameStateManager.js';
import {RLAgent} from '../client/src/ai/RLAgent.js';
const fixtures=JSON.parse(await readFile(new URL('./fixtures/stag-variable-dp-reference.json',import.meta.url)));
const rotate=([r,c],k)=>{for(let i=0;i<k;i++)[r,c]=[c,8-r];return[r,c]};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const dp=new DiscountedJointDP();
const loader=Object.create(MapLoader.prototype);
const originalLog=console.log;console.log=()=>{};
try{
 const context=vm.createContext({});vm.runInContext(await readFile(new URL('../config/MapsForStagHunt.js',import.meta.url),'utf8'),context);
 assert.equal(JSON.stringify(context.MapsForStagHunt),JSON.stringify(StagHuntMaps));
 const coords=JSON.parse(await readFile(new URL('../config/stag_hunt_maps_coordinates.json',import.meta.url)));
 assert.deepEqual(coords.maps,Object.values(StagHuntMaps).map(xs=>xs[0]));
 for(const fixture of fixtures){
  const m=StagHuntMaps[fixture.id][0],k=(fixture.id-1)%4,base=fixture.canonicalSpec;
  assert.deepEqual(m.orange,rotate(base.aiStart,k));assert.deepEqual(m.red,rotate(base.childStart,k));
  assert.deepEqual(m.obstacles,base.obstacles.map(p=>rotate(p,k)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]));
  const grid=m.ascii.map(row=>[...row].map(c=>c==='#'?4:0)),goals=[m.stag,...m.rabbits],types=['big','small','small'];
  const p=dp.planner(grid,goals,types),s=p.index.get(m.orange.join(','))*p.N+p.index.get(m.red.join(','));near(p.V[60*p.S+s],fixture.value);
  const d=dp.distribution(grid,m.orange,m.red,goals,types);
  fixture.openingProbabilities.forEach((prob,a)=>{let [dr,dc]=DP_ACTIONS[a];for(let i=0;i<k;i++)[dr,dc]=[dc,-dr];const rotated=DP_ACTIONS.findIndex(x=>x[0]===dr&&x[1]===dc);near(d.probabilities[rotated],prob)});
  assert.equal(dp.getAction(grid,m.stag,m.red,goals,types),null);
  assert.equal(dp.getAction(grid,m.orange,m.red,goals,types,60),null);
  const one=dp.distribution(grid,m.orange,m.red,goals,types,59);assert.equal(one.remainingTurns,1);
  near(one.probabilities.reduce((a,b)=>a+b,0),1);
 }
 const maps=loader.processMapData(StagHuntMaps),schedule=loader.selectRandomMaps(maps,21,'StagHunt');
 assert.equal(schedule.length,21);assert(schedule.slice(0,5).every(m=>m.trial_phase==='onboarding'));
 assert.equal(new Set(schedule.slice(5).map(m=>m.map_id)).size,16);assert(schedule.slice(5).every(m=>m.trial_phase==='main'));
 for(let i=0;i<21;i++)assert.equal(GameConfigUtils.shouldSwapPlayerStartPositions('StagHunt',i),false);
 assert.equal(CONFIG.game.players.player2.type,'rl_joint');assert.equal(CONFIG.multiplayer.fallbackAIType,'rl_joint');
 const gsm=new GameStateManager();const m=maps['1'][0];gsm.initializeTrial(0,'StagHunt',m);
 assert.equal(gsm.currentState.player1CurrentPoints,0);assert.equal(gsm.getStepPenaltyForCurrentTrial(),0);gsm.applyStepPenalty(1);assert.equal(gsm.currentState.player1CurrentPoints,0);
 assert.equal(gsm.trialData.player1Role,'Signaler');assert.equal(gsm.trialData.player2Role,'Signaler');
 const rl=new RLAgent();let recorded;
 const action=rl.getAIAction(gsm.currentState.gridMatrix,gsm.currentState.player2,gsm.currentState.currentGoals,gsm.currentState.player1,{experimentType:'StagHunt',goalTypes:gsm.currentState.currentGoalTypes,completedTurns:59,recordDPDecision:d=>recorded=d});assert.equal(recorded.remainingTurns,1);assert(DP_ACTIONS.some(d=>d[0]===action[0]&&d[1]===action[1]));
 gsm.currentState.player1=[...m.rabbits[0]];gsm.checkTrialCompletion();assert.equal(gsm.currentState.player1CurrentPoints,0); // Deferred settlement.
 gsm.currentState.player2=[...m.rabbits[0]];assert(gsm.checkTrialCompletion());assert.equal(gsm.currentState.player1CurrentPoints,.5);assert.equal(gsm.currentState.player2CurrentPoints,.5);
 gsm.initializeTrial(1,'StagHunt',m);assert.deepEqual(gsm.trialData.dpDecisions,[]);gsm.currentState.player1=[...m.stag];gsm.currentState.player2=[...m.stag];assert(gsm.checkTrialCompletion());assert.equal(gsm.currentState.player1CurrentPoints,5);assert.equal(gsm.currentState.player2CurrentPoints,5);
 gsm.initializeTrial(2,'StagHunt',m);gsm.currentState.player1=[...m.rabbits[0]];gsm.stepCount=60;assert(gsm.checkTrialCompletion());assert.equal(gsm.currentState.player1CurrentPoints,1);assert.equal(gsm.currentState.player2CurrentPoints,0);
}finally{console.log=originalLog}
console.log('PASS: 16 maps, server/fallback parity, rotated reference DP values and action probabilities, 5+16 schedule, default agent, remaining horizon, goal locking, terminal/timeout/same-hare scoring, zero displayed cost and per-trial logs.');
