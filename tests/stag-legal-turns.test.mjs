import assert from 'node:assert/strict';
import {CONFIG} from '../client/src/config/gameConfig.js';
import {StagHuntMaps} from '../client/src/data/StagHuntMaps.js';
import {MapLoader} from '../client/src/utils/MapLoader.js';
import {GameStateManager} from '../client/src/game/GameStateManager.js';
import {ExperimentManager} from '../client/src/experiments/ExperimentManager.js';
const loader=Object.create(MapLoader.prototype);
const log=console.log;console.log=()=>{};
function make(){const g=new GameStateManager();g.initializeTrial(0,'StagHunt',loader.normalizeStagHuntMap(StagHuntMaps['1'][0]));return g;}
const snapshot=g=>JSON.stringify({state:g.currentState,data:g.trialData,steps:g.stepCount,moving:g.isMoving});
try{
 assert.equal(CONFIG.game.requireBothLegalMoves,true);
 for(const [human,ai]of [['right','right'],['up','up'],['up',null],[null,'right'],['unknown','right'],['up','unknown']]){
  const g=make(),before=snapshot(g),r=g.processSynchronizedMoves(human,ai);assert.equal(r.success,false);assert.equal(r.reason,'illegal_joint_move');assert.equal(snapshot(g),before);
 }
 const wall=make();wall.currentState.player1=[7,8];const before=snapshot(wall);assert.equal(wall.processSynchronizedMoves('left','right').success,false);assert.equal(snapshot(wall),before);
 const good=make();assert(good.processSynchronizedMoves('up','right').success);assert.deepEqual(good.currentState.player1,[7,8]);assert.deepEqual(good.currentState.player2,[0,1]);assert.equal(good.stepCount,1);assert.equal(good.trialData.player1Actions.length,1);assert.equal(good.trialData.player2Actions.length,1);
 const mapped=make();assert(mapped.processSynchronizedMovesMapped(2,'right','up').success);assert.deepEqual(mapped.currentState.player1,[7,8]);assert.deepEqual(mapped.currentState.player2,[0,1]);
 const mappedBad=make(),mb=snapshot(mappedBad);assert.equal(mappedBad.processSynchronizedMovesMapped(2,'up','up').success,false);assert.equal(snapshot(mappedBad),mb);
 for(const locked of [1,2]){const g=make();g.currentState[`player${locked}`]=[4,4];const r=g.processSynchronizedMoves(locked===1?null:'up',locked===2?null:'right');assert(r.success);assert.equal(g.stepCount,1);assert.deepEqual(g.currentState[`player${locked}`],[4,4]);assert.equal(g.trialData[`player${locked}Actions`].length,0)}
 const done=make();done.currentState.player1=[4,4];done.currentState.player2=[4,4];const db=snapshot(done);assert.equal(done.processSynchronizedMoves(null,null).reason,'all_players_locked');assert.equal(snapshot(done),db);
 CONFIG.game.requireBothLegalMoves=false;const legacy=make();assert(legacy.processSynchronizedMoves('right','right').success);assert.equal(legacy.stepCount,1);CONFIG.game.requireBothLegalMoves=true;
 // Verify the actual controller avoids AI sampling on invalid input and gates
 // overlapping asynchronous requests before applying either action.
 const controller=Object.create(ExperimentManager.prototype);controller.gameStateManager=make();controller.aiPlayerNumber=2;controller.rlAgent={};controller.uiManager={updateGameDisplay(){}};controller.handleTrialComplete=()=>{};
 let calls=0,release;
 controller.generateAIDirection=()=>{calls++;return new Promise(resolve=>release=()=>resolve({aiDirection:'right',gptError:null}));};
 await controller.handleSynchronizedMove('right');assert.equal(calls,0);
 const turn=controller.handleSynchronizedMove('up');await controller.handleSynchronizedMove('up');assert.equal(calls,1);release();await turn;assert.equal(controller.gameStateManager.stepCount,1);assert.equal(controller.synchronizedDecisionPending,false);
 controller.gameStateManager=make();controller.generateAIDirection=async()=>({aiDirection:'up',gptError:null});const cb=snapshot(controller.gameStateManager);await controller.handleSynchronizedMove('up');assert.equal(snapshot(controller.gameStateManager),cb);
 controller.generateAIDirection=async()=>{throw Error('test rejection')};await assert.rejects(controller.handleSynchronizedMove('up'),/test rejection/);assert.equal(controller.synchronizedDecisionPending,false);
}finally{CONFIG.game.requireBothLegalMoves=true;console.log=log}
console.log('PASS: atomic joint legality, walls/bounds/missing actions, swapped roles, goal-locked stays, no-op rejection, legacy opt-out, no invalid-input AI rerolls, and asynchronous request gating.');
