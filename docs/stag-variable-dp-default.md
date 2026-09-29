# Default cake study: 16 variable-distance maps and discounted joint DP

The cake branch now defaults to `rl_joint`, implemented for StagHunt by
`DiscountedJointDP`. No API key is required. Both the initial partner and
multiplayer fallback select this agent; explicit `?ai=` overrides still work.
Other experiment types retain their existing RL implementations.

## Maps and schedule

The 16 selected occupied-hare-pocket maps replace the previous 18-map set in
all three data sources: client fallback, server config, and coordinate JSON.
Only the occupied hare wall cells are opened. Stag stays at [4,4]; both starts
are opposite corners and 8 steps from stag. Both players can signal. Each map
has the same assigned rotation as the pilot (index modulo four), yielding four
maps per orientation. No additional start-position swaps are applied.

The existing cake timeline remains 1 + 4 + 16 = 21 rounds. The first five are
onboarding repetitions of map IDs 2, 1, 5, 3, 9, with the same payoff rules.
The final sixteen are shuffled without replacement, so each selected map
occurs exactly once in the main block. Exports identify onboarding versus main,
source map, rotation, distance, utility and participant reward parameters.

## Agent and reward semantics

Finite-horizon max-Bellman DP: horizon 60, gamma .9, actual-move cost .9.
Team terminal reward is 10 for joint stag, 1 per distinct hare; both at the same
hare yield total 1. Already captured hare rewards survive timeout. Goal arrival
absorbs. Costs occur on transitions; capture rewards settle at joint episode end.
At each real state and remaining horizon, softmax with temperature .2 is applied
to the 16 legal joint-action Q values; probabilities are summed over the
partner's action. Only the AI marginal is sampled. Pending human direction is
not an input to the planner. No target sampling or route quotas are imposed.
Each decision exports probabilities, selected action, positions and horizon.

The human sees 5/1 rewards, no movement deduction and no initial point bonus.
AI movement cost is a latent utility parameter, separate from displayed scores.
Same-hare numeric scoring splits 1 equally. The existing cake animations remain
outcome-based. New-map numeric rewards settle on completion/timeout, preventing
an early hare payment from incorrectly doubling the shared-hare reward.

Self-play aggregate path balance is not guaranteed with a human partner.

## Validation

`npm run test:stag-dp` checks server/client/JSON parity, each rotated geometry
against the selected-map reference, all sixteen opening DP values and action
marginals against the original pilot, horizon/goal locking, 5+16 scheduling,
no role swaps, default partner/fallback, deferred and timeout scoring, shared
hare split, zero participant movement cost and per-trial decision-log reset.
`npm run build` passes. Browser testing completed a cooperative eight-turn round
in the actual cake interface and displayed the cake reward.

The repository's older `node test-integration.js` is not a clean validation:
its MockUIManager lacks setupGameCanvasInContainer and produces asynchronous
trial-start errors. That unrelated mock was left unchanged.
