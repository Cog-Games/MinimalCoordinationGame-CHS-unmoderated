import {DiscountedJointDP,DP_ACTIONS,DP_DEFAULTS} from './DiscountedJointDP.js';
export const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
export function normalize(w){const total=w.reduce((a,b)=>a+b,0);return total>0?w.map(x=>x/total):w.map(()=>1/w.length)}
export function softmax(q,T=.1){const mx=Math.max(...q);if(!Number.isFinite(mx))return q.map(()=>0);return normalize(q.map(v=>Number.isFinite(v)?Math.exp((v-mx)/T):0))}
export function sample(p,rng){let u=rng(),last=p.findLastIndex(x=>x>0);for(let i=0;i<p.length;i++){u-=p[i];if(u<0)return i}return last}
export class PlanModel {
 constructor(grid,goals,types){this.grid=grid;this.goals=goals;this.types=types;this.base=new DiscountedJointDP();this.m=this.base.planner(grid,goals,types);this.plans=[];const m=this.m,{cost,gamma,horizon}=DP_DEFAULTS;
  for(let g=0;g<goals.length;g++)for(let f=0;f<goals.length;f++){
   const target=[m.index.get(goals[g].join(',')),m.index.get(goals[f].join(','))];
   const ds=target.map(t=>{const d=new Float64Array(m.N).fill(Infinity);d[t]=0;const q=[t];for(let i=0;i<q.length;i++)for(let p=0;p<m.N;p++){if(m.types[p]>=0&&p!==t)continue;if(!Number.isFinite(d[p])&&m.moves[p].some(a=>m.next[p*4+a]===q[i])){d[p]=d[q[i]]+1;q.push(p)}}return d});
   const valid=new Uint8Array(m.S),pairs=Array.from({length:m.S},()=>[]),V=new Float64Array((horizon+1)*m.S).fill(-Infinity);const terminal=target[0]*m.N+target[1],reward=m.payoff[terminal];
   for(let s=0;s<m.S;s++){const p=Math.floor(s/m.N),q=s%m.N;valid[s]=Number(Number.isFinite(ds[0][p])&&Number.isFinite(ds[1][q]));if(valid[s])pairs[s]=m.pairs[s].filter(u=>Number.isFinite(ds[0][Math.floor(u.next/m.N)])&&Number.isFinite(ds[1][u.next%m.N]));}
   V[terminal]=reward;
   for(let h=1;h<=horizon;h++)for(let s=0;s<m.S;s++){if(!valid[s])continue;if(s===terminal){V[h*m.S+s]=reward;continue;}let best=-Infinity;for(const u of pairs[s])best=Math.max(best,-cost*u.moves+gamma*V[(h-1)*m.S+u.next]);V[h*m.S+s]=best;}
   this.plans.push({goals:[g,f],target,ds,V,pairs,reward});
  }
  this.policyCache=new Map();
 }
 state(pos){return this.m.index.get(pos[0].join(','))*this.m.N+this.m.index.get(pos[1].join(','))}
 conditional(pos,h){const s=this.state(pos),key=s+':'+h;if(this.policyCache.has(key))return this.policyCache.get(key);const {cost,gamma,tau}=DP_DEFAULTS,m=this.m;
 const result=this.plans.map(z=>{const value=z.V[h*m.S+s],probs=[[0,0,0,0],[0,0,0,0]];if(h>0&&Number.isFinite(value)){const pairs=z.pairs[s],w=softmax(pairs.map(u=>-cost*u.moves+gamma*z.V[(h-1)*m.S+u.next]),tau);pairs.forEach((u,i)=>{probs[0][u.a]+=w[i];probs[1][u.b]+=w[i]})}return {value,probs}});this.policyCache.set(key,result);return result;
 }
}
export class SAAgent {
 constructor(model,actor,{lambda=.2,pSignal=.5}={}){this.model=model;this.actor=actor;this.lambda=lambda;this.pSignal=pSignal;this.belief=model.plans.map(()=>1/model.plans.length);this.listener=[...this.belief];this.previousPlan=null;}
 observe(before,actions,h){const conditional=this.model.conditional(before,h),other=1-this.actor;
  // Both updates use the pre-transition state, never the partner's simultaneous next action at decision time.
  if(actions[other]!==null)this.belief=normalize(this.belief.map((b,z)=>Math.max(1e-12,b)*Math.max(1e-6,conditional[z].probs[other][actions[other]])));
  if(actions[this.actor]!==null)this.listener=normalize(this.listener.map((b,z)=>Math.max(1e-12,b)*Math.max(1e-6,conditional[z].probs[this.actor][actions[this.actor]])));
 }
 decide(pos,h,rng){const model=this.model,m=model.m,actor=this.actor,p=m.index.get(pos[actor].join(','));if(m.types[p]>=0)return {action:null,locked:true};
  const cond=model.conditional(pos,h),logWeights=cond.map((c,z)=>c.value/.1+this.lambda*Math.log(Math.max(1e-12,this.belief[z]))),weights=softmax(logWeights,1);
  if(!weights.some(x=>x>0)){const d=model.base.distribution(model.grid,pos[actor],pos[1-actor],model.goals,model.types,60-h);return {action:sample(d.probabilities,rng),fallback:true}}
  const zi=sample(weights,rng),plan=model.plans[zi],base=cond[zi].probs[actor],baseAction=sample(base,rng);const listenerPrior=normalize(this.listener.map((b,i)=>Number.isFinite(cond[i].value)?b:0));
  const scores=[null,null,null,null];let best=-Infinity,candidates=[];
  for(const a of m.moves[p]){const q=m.next[p*4+a];if(!(plan.ds[actor][q]<plan.ds[actor][p])||base[a]===0)continue;
   const after=normalize(listenerPrior.map((b,z)=>b*cond[z].probs[actor][a]));const score=after.reduce((sum,b,z)=>sum+(model.plans[z].goals[actor]===plan.goals[actor]?b:0),0);scores[a]=score;
   if(score>best+1e-12){best=score;candidates=[a]}else if(Math.abs(score-best)<1e-12)candidates.push(a);
  }
  const signalAction=candidates.length?candidates[Math.floor(rng()*candidates.length)]:null;const signal=signalAction!==null&&rng()<this.pSignal,action=signal?signalAction:baseAction;
  const decision={action,plan:zi,targets:plan.goals,belief:[...this.belief],listener:[...this.listener],planWeights:weights,baseProbabilities:base,baseAction,signalAction,signal,scores,changed:signal&&action!==baseAction,switched:this.previousPlan!==null&&this.previousPlan!==zi};this.previousPlan=zi;return decision;
 }
}
export {DP_ACTIONS};
