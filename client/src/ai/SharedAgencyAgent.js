import {PlanModel, SAAgent, DP_ACTIONS} from './SharedAgencyCore.js';
import {DP_DEFAULTS} from './DiscountedJointDP.js';
export const SA_PARAMETERS = Object.freeze({...DP_DEFAULTS, lambda: .2, pSignal: .75, goalTemperature: .1, policyVersion: 'shared-agency-v1-l02-p075', beliefFloor:1e-12, likelihoodFloor:1e-6, rng:'mulberry32-v1'});
export function seededRandom(seed) {return () => {let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
export class SharedAgencyAgent {
  constructor(){this.trial=null;this.model=null;this.agent=null;this.lastRecord=null;}
  action(state,trial,actor,step) {
    if(this.trial!==trial || this.trialId!==trial.trialId || this.actor!==actor){
      const grid=state.gridMatrix.map(row=>row.map(x=>x===4?4:0));
      this.model=new PlanModel(grid,state.currentGoals,state.currentGoalTypes);
      this.agent=new SAAgent(this.model,actor,SA_PARAMETERS);this.actor=actor;this.trial=trial;this.trialId=trial.trialId;
      const seed=globalThis.crypto?.getRandomValues(new Uint32Array(1))[0] ?? Math.floor(Math.random()*2**32);
      this.random=seededRandom(seed);this.lastRecord=null;
      trial.agentPolicyVersion=SA_PARAMETERS.policyVersion;trial.saLambda=SA_PARAMETERS.lambda;trial.saPSignal=SA_PARAMETERS.pSignal;trial.agentSeed=seed;
      trial.agentModel={type:'shared-agency',...SA_PARAMETERS,seed,actor:actor+1,planGoalIndices:this.model.plans.map(p=>p.goals),goals:state.currentGoals.map(p=>[...p]),observationTiming:'after-committed-turn',commitment:'resample-every-step'};
    }
    const pos=[state.player1,state.player2];const h=Math.max(0,SA_PARAMETERS.horizon-step);
    const belief=[...this.agent.belief],listener=[...this.agent.listener];
    const decision=this.agent.decide(pos,h,this.random);
    const record={type:'sa_decision',policy:SA_PARAMETERS.policyVersion,step,turnId:step,at:Date.now(),parameters:{...SA_PARAMETERS},seed:trial.agentModel.seed,actor:actor+1,remainingHorizon:h,stateBefore:pos.map(p=>[...p]),beliefBefore:belief,listenerBefore:listener,...decision};
    if(decision.fallback){record.fallbackReason='all_goal_plans_infeasible';record.effectivePolicy='shared-cakes-step-beta3-v1';}
    (trial.dpDecisions ||= []).push(record);this.lastRecord=record;
    return decision.action==null?null:[...DP_ACTIONS[decision.action]];
  }
  observeTurn(before,after,step,trial){
    if(trial!==this.trial || trial.trialId!==this.trialId || !this.agent)return;
    const pos=[before.player1,before.player2],next=[after.player1,after.player2];
    const actions=pos.map((p,i)=>{const a=DP_ACTIONS.findIndex(d=>p[0]+d[0]===next[i][0]&&p[1]+d[1]===next[i][1]);return a<0?null:a;});
    this.agent.observe(pos,actions,Math.max(0,SA_PARAMETERS.horizon-step));
    const update={type:'sa_belief_update',turnId:step,at:Date.now(),observedActions:actions,beliefAfter:[...this.agent.belief],listenerAfter:[...this.agent.listener]};
    (trial.saBeliefUpdates ||= []).push(update);
    if(this.lastRecord?.step===step)Object.assign(this.lastRecord,{observedActions:actions,beliefAfter:update.beliefAfter,listenerAfter:update.listenerAfter});
  }
}
