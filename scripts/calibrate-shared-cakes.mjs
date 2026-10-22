import {DiscountedJointDP} from '../client/src/ai/DiscountedJointDP.js';
import {StagHuntMaps} from '../client/src/data/StagHuntMaps.js';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const costs=(process.argv[2]||'0,.05,.1,.15,.2,.25,.3,.35,.4,.45,.5,.6,.9').split(',').map(Number),sessions=+(process.argv[3]||100),seed=+(process.argv[4]||20261022),out=process.argv[5]||'output/shared-calibration';mkdirSync(out,{recursive:true});
assert(Number.isInteger(sessions)&&sessions>0,'sessions must be a positive integer');
assert(costs.every(c=>Number.isFinite(c)&&c>=0),'invalid cost');
function rng(n){return ()=>{let t=n+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
function classify(start,first,end,map,actor){if(!first)return'U';let a=[...start],b=[...first],target=actor===0?[8,8]:[0,0];for(let k=0;k<4&&!eq(a,target);k++){a=[a[1],8-a[0]];b=[b[1],8-b[0]];}assert(eq(a,target));const clear=eq(b,actor===0?[8,7]:[0,1]);return eq(end,map.stag)?(clear?'CS':'AS'):map.rabbits.some(g=>eq(g,end))?(clear?'CH':'AH'):'U'}
const normalized=process.argv[6]==='normalized-beta3';
const taus=normalized?[null]:(process.argv[6]||'.2').split(',').map(Number);
assert(normalized?costs.every(c=>c>0):taus.every(t=>Number.isFinite(t)&&t>0),'positive tau (and positive cost for normalized mode) required');
const results=[];
for(const temperature of taus)for(const cost of costs){const tau=normalized?cost/3:temperature;const dp=new DiscountedJointDP({cost,gamma:.9,tau,horizon:60,jointStagReward:5,hareReward:1});const counts=[{CS:0,AS:0,AH:0,CH:0,U:0},{CS:0,AS:0,AH:0,CH:0,U:0}],outcomes={SS:0,SH:0,HS:0,HH:0,U:0};let cake=0,totalTurns=0,totalMoves=0,totalReversals=0,pathsWithReversal=0;const byMap=[];
 for(const [mi,arr]of Object.entries(StagHuntMaps)){const m=arr[0],grid=m.ascii.map(r=>[...r].map(v=>v==='#'?4:0)),goals=[m.stag,...m.rabbits],types=['big','small','small'];const model=dp.planner(grid,goals,types);const idx=p=>model.index.get(p.join(','));assert.equal(model.payoff[idx(m.stag)*model.N+idx(m.stag)],5);assert.equal(model.payoff[idx(m.rabbits[0])*model.N+idx(m.rabbits[1])],2);assert.equal(model.payoff[idx(m.stag)*model.N+idx(m.rabbits[0])],1);assert.equal(model.payoff[idx(m.rabbits[0])*model.N+idx(m.rabbits[0])],1);const mc={CS:0,AS:0,AH:0,CH:0,U:0};
 for(let s=0;s<sessions;s++){let pos=[[...m.red],[...m.orange]],first=[null,null],paths=[[m.red],[m.orange]];let turns=0;const random=[rng(seed+Number(mi)*100003+s*101),rng(seed+Number(mi)*100003+s*101+7919)];
 for(let t=0;t<60;t++){const actions=pos.map((p,i)=>dp.getAction(grid,p,pos[1-i],goals,types,t,random[i]));if(actions.every(a=>a===null))break;turns++;pos=pos.map((p,i)=>{if(!actions[i])return p;const q=p.map((v,j)=>v+actions[i][j]);assert(grid[q[0]]?.[q[1]]===0);first[i]??=q;paths[i].push(q);return q});}
 totalTurns+=turns;for(const path of paths){const rev=path.slice(2).filter((p,i)=>eq(p,path[i])).length;totalMoves+=path.length-1;totalReversals+=rev;pathsWithReversal+=Number(rev>0);}
 const cl=pos.map((p,i)=>classify(i?m.orange:m.red,first[i],p,m,i));cl.forEach((c,i)=>counts[i][c]++);mc[cl[0]]++;const oc=cl.includes('U')?'U':pos.map(p=>eq(p,m.stag)?'S':'H').join('');outcomes[oc]++;cake+=model.payoff[idx(pos[0])*model.N+idx(pos[1])];}
 byMap.push({map:Number(mi),p1:mc});}
 const n=sessions*16,p1=Object.fromEntries(Object.entries(counts[0]).map(([k,v])=>[k,v/n]));const loss=Math.max(...['CS','AS','AH'].map(k=>Math.abs(p1[k]-1/3)));const row={normalization:normalized?'unit-step-cost-beta3':'raw-Q',cost,gamma:.9,tau,sessions,seed,episodes:n,p1,counts,outcomes,meanCake:cake/n,meanTurns:totalTurns/n,meanMovesPerPlayer:totalMoves/(2*n),meanReversalsPerPlayer:totalReversals/(2*n),reversalPathRate:pathsWithReversal/(2*n),maxDeviation:loss,byMap};results.push(row);console.log(JSON.stringify({cost,tau,p1,maxDeviation:loss}));writeFileSync(out+'/summary.json',JSON.stringify(results,null,2));}
