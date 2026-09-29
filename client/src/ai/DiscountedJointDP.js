// Finite-horizon max-Bellman DP, followed by joint-action softmax and
// marginalization over the partner's action. Only the AI action is sampled.
export const DP_ACTIONS = [[0, -1], [0, 1], [-1, 0], [1, 0]];
export const DP_DEFAULTS = Object.freeze({ cost: 0.9, gamma: 0.9, tau: 0.2, horizon: 60, stagReward: 5, hareReward: 1 });
const key = p => p.join(',');
export class DiscountedJointDP {
  constructor(parameters = {}) {
    this.parameters = { ...DP_DEFAULTS, ...parameters };
    this.cache = new Map();
  }
  planner(grid, goals, goalTypes) {
    const { cost, gamma, horizon, stagReward, hareReward } = this.parameters;
    const size = grid.length;
    const walls = grid.flatMap((row, r) => row.flatMap((v, c) => v === 4 ? [[r, c]] : []));
    const cacheKey = JSON.stringify([size, walls, goals, goalTypes]);
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
    if (goalTypes?.length !== goals.length) throw Error('DP requires explicit goal types');
    const wallSet = new Set(walls.map(key));
    const cells = [];
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!wallSet.has(key([r,c]))) cells.push([r,c]);
    const index = new Map(cells.map((p,i) => [key(p), i]));
    const N = cells.length, S = N*N;
    const types = new Int16Array(N).fill(-1);
    goals.forEach((p,i) => { if (!index.has(key(p))) throw Error('Goal in wall'); types[index.get(key(p))] = i; });
    const moves = cells.map(() => []), next = new Int16Array(N*4).fill(-1);
    cells.forEach(([r,c],p) => {
      if (types[p] >= 0) { moves[p] = [0]; next[p*4] = p; return; }
      DP_ACTIONS.forEach(([dr,dc],a) => { const q = index.get(key([r+dr,c+dc])); if (q !== undefined) { moves[p].push(a); next[p*4+a] = q; } });
    });
    const terminal = new Uint8Array(S), payoff = new Float64Array(S), pairs = Array.from({length:S},()=>[]);
    for (let p=0;p<N;p++) for (let q=0;q<N;q++) {
      const s=p*N+q,g=types[p],f=types[q];
      terminal[s]=Number(g>=0&&f>=0);
      // Payoff also covers timeout: an already caught hare retains its reward.
      const gh=g>=0&&goalTypes[g]==='small', fh=f>=0&&goalTypes[f]==='small';
      payoff[s]=g>=0&&g===f&&goalTypes[g]==='big'?2*stagReward:(gh?hareReward:0)+(fh&&f!==g?hareReward:0);
      for (const a of moves[p]) for (const b of moves[q]) pairs[s].push({a,b,next:next[p*4+a]*N+next[q*4+b],moves:Number(next[p*4+a]!==p)+Number(next[q*4+b]!==q)});
    }
    const V = new Float64Array((horizon+1)*S); V.set(payoff);
    // Costs on transition t; capture rewards settled at the joint terminal state.
    for (let h=1;h<=horizon;h++) for (let s=0;s<S;s++) {
      if (terminal[s]) { V[h*S+s]=payoff[s]; continue; }
      let best=-Infinity;
      for (const u of pairs[s]) best=Math.max(best,-cost*u.moves+gamma*V[(h-1)*S+u.next]);
      V[h*S+s]=best;
    }
    const model={N,S,cells,index,types,moves,next,terminal,payoff,pairs,V};
    // Bound cache when testing additional map sets or rotations.
    if (this.cache.size>=24) this.cache.delete(this.cache.keys().next().value);
    this.cache.set(cacheKey,model); return model;
  }
  distribution(grid, ai, partner, goals, goalTypes, completedTurns=0) {
    const m=this.planner(grid,goals,goalTypes),p=m.index.get(key(ai)),q=m.index.get(key(partner));
    if (p===undefined||q===undefined) throw Error('DP player outside walkable map');
    const {cost,gamma,tau,horizon}=this.parameters;
    const h=Math.max(0,Math.min(horizon,horizon-completedTurns));
    if (m.types[p]>=0||h===0) return {probabilities:[0,0,0,0],remainingTurns:h,locked:true};
    const s=p*m.N+q,actions=m.pairs[s];
    const qs=actions.map(u=>-cost*u.moves+gamma*m.V[(h-1)*m.S+u.next]);
    const max=Math.max(...qs),weights=qs.map(v=>Math.exp((v-max)/tau)),total=weights.reduce((a,b)=>a+b,0);
    const probabilities=[0,0,0,0];actions.forEach((u,i)=>probabilities[u.a]+=weights[i]/total);
    return {probabilities,remainingTurns:h,locked:false};
  }
  getAction(grid,ai,partner,goals,goalTypes,completedTurns=0,rng=Math.random) {
    const result=this.distribution(grid,ai,partner,goals,goalTypes,completedTurns);
    this.lastDecision={...result,parameters:{...this.parameters},aiPosition:[...ai],partnerPosition:[...partner]};
    if (result.locked) return null;
    const u=rng();let cumulative=0,chosen=result.probabilities.findLastIndex(p=>p>0);
    for(let a=0;a<4;a++){cumulative+=result.probabilities[a];if(u<cumulative){chosen=a;break;}}
    this.lastDecision.action=chosen;
    return [...DP_ACTIONS[chosen]];
  }
}
