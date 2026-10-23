import assert from 'node:assert/strict';
import {DiscountedJointDP} from '../client/src/ai/DiscountedJointDP.js';
import {StagHuntMaps} from '../client/src/data/StagHuntMaps.js';
// Dividing every reward/cost by c must preserve action probabilities
// when raw temperature c/3 becomes normalized temperature 1/3.
for (const cost of [.2,.3,.4]) {
 const raw=new DiscountedJointDP({cost,tau:cost/3,jointStagReward:5,hareReward:1});
 const scaled=new DiscountedJointDP({cost:1,tau:1/3,jointStagReward:5/cost,hareReward:1/cost});
 for (const id of [1,5,10]) {
  const m=StagHuntMaps[id][0],grid=m.ascii.map(r=>[...r].map(c=>c==='#'?4:0)),goals=[m.stag,...m.rabbits],types=['big','small','small'];
  for (const t of [0,30,59]) for (const [a,b] of [[m.red,m.orange],[m.orange,m.red]]) {
   const p=raw.distribution(grid,a,b,goals,types,t).probabilities;
   const q=scaled.distribution(grid,a,b,goals,types,t).probabilities;
   p.forEach((v,i)=>assert(Math.abs(v-q[i])<1e-10));
  }
 }
}
console.log('PASS normalized beta=3 preserves scaled-utility action probabilities.');
