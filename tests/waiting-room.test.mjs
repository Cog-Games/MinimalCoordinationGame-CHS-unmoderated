import assert from 'node:assert/strict';
import {TimelineManager} from '../client/src/timeline/TimelineManager.js';
import {CONFIG} from '../client/src/config/gameConfig.js';
const real={now:Date.now,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout,document:globalThis.document};
let now=100000,id=0,timers=new Map(),keys=new Set();
Date.now=()=>now;globalThis.setTimeout=(fn,ms)=>{timers.set(++id,{fn,at:now+ms});return id};globalThis.clearTimeout=id=>timers.delete(id);
globalThis.document={addEventListener:(_,f)=>keys.add(f),removeEventListener:(_,f)=>keys.delete(f)};
const tick=ms=>{const end=now+ms;while(true){const n=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!n)break;now=n[1].at;timers.delete(n[0]);n[1].fn()}now=end};
const press=(repeat=false)=>[...keys].forEach(f=>f({key:'Enter',repeat,preventDefault(){},stopImmediatePropagation(){}}));
const originalType=CONFIG.game.players.player2.type;
function start(type='rl_joint'){
 CONFIG.game.players.player2.type=type;
 const t=Object.create(TimelineManager.prototype);t.container={};t.eventHandlers=new Map();t.nextStage=()=>t.advances++;t.advances=0;t.recordWaitingTime=(...x)=>t.record=x;
 t.showWaitingForPartnerStage('StagHunt',1);return t;
}
try{
 let t=start();tick(8999);assert.equal(t.advances,0);tick(1);assert.equal(t.advances,1);assert.equal(t.record[2],9000);assert.equal(keys.size,0);
 t=start();press();press(true);assert.equal(t.advances,0);tick(601);press();assert.equal(t.advances,0);tick(100);press();assert.equal(t.advances,1);assert.equal(t.record[3],'hidden-double-enter');tick(10000);assert.equal(t.advances,1);
 t=start('human');tick(9000);assert.equal(t.advances,1);assert.equal(t.record[3],'timeout');
 t=start('human');t.emit('partner-connected',{});tick(8999);assert.equal(t.advances,0);tick(1);assert.equal(t.advances,1);assert.equal(t.record[3],'partner_found');tick(10000);assert.equal(t.advances,1);
 t=start();t._waitingCleanup();tick(10000);assert.equal(t.advances,0);assert.equal(keys.size,0);
 console.log('PASS 9-second AI/human wait, partner arrival, hidden double Enter, repeat rejection, cleanup and no double advance.');
}finally{Date.now=real.now;globalThis.setTimeout=real.setTimeout;globalThis.clearTimeout=real.clearTimeout;globalThis.document=real.document;CONFIG.game.players.player2.type=originalType;}
