import assert from 'node:assert/strict';
import {DiscountedJointDP,DP_DEFAULTS} from '../client/src/ai/DiscountedJointDP.js';
import {CONFIG} from '../client/src/config/gameConfig.js';
import {StagHuntMaps} from '../client/src/data/StagHuntMaps.js';
assert.equal(CONFIG.game.agent.stagHuntDP.jointStagReward,5);assert.equal(DP_DEFAULTS.cost,.30);
assert.equal(DP_DEFAULTS.tau,.10);assert.equal(CONFIG.game.agent.stagHuntDP.cost,.30);assert.equal(CONFIG.game.agent.stagHuntDP.tau,.10);
const m=StagHuntMaps[1][0],grid=m.ascii.map(r=>[...r].map(c=>c==='#'?4:0)),goals=[m.stag,...m.rabbits],types=['big','small','small'];
const dp=new DiscountedJointDP(),model=dp.planner(grid,goals,types),idx=p=>model.index.get(p.join(',')),state=(a,b)=>idx(a)*model.N+idx(b);
for(const[a,b,v]of [[m.stag,m.stag,5],[m.stag,m.rabbits[0],1],[m.rabbits[0],m.stag,1],[m.rabbits[0],m.rabbits[1],2],[m.rabbits[0],m.rabbits[0],1]]){const s=state(a,b);assert.equal(model.payoff[s],v);assert.equal(model.V[60*model.S+s],v);}
const probs=dp.distribution(grid,m.orange,m.red,goals,types).probabilities;assert(probs.every(p=>Number.isFinite(p)&&p>=0));assert(Math.abs(probs.reduce((a,b)=>a+b,0)-1)<1e-12);
// Changing utility must invalidate cached values, not reuse old rewards.
dp.parameters.jointStagReward=10;const old=dp.planner(grid,goals,types);assert.notEqual(old,model);assert.equal(old.payoff[state(m.stag,m.stag)],10);
console.log('PASS shared-output payoff, terminal values, config, parameter-sensitive cache.');
