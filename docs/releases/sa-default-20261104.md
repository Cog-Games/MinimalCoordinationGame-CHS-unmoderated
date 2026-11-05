# SA production default — 2026-11-04

The formal free-choice game now defaults to shared-agency v1, lambda=0.2 and pSignal=0.75. The underlying planner retains cost=0.30, tau=0.10, gamma=0.9, horizon=60, joint Stag reward=5 and individual Hare reward=1. The four instructed practice trials retain their scripted goals and routes. Explicit `?ai=rl_joint` remains available for the previous baseline; distribute the root URL for SA.

Each formal trial records policy version, lambda, pSignal, RNG seed, goal-plan mapping and full parameters. AgentDecisions records goal sampling, beliefs, listener beliefs, ordinary/signaling actions and actual action replacement; SABeliefUpdates records observed committed actions and resulting posteriors, including the final turn. RawJSON retains the complete snapshot. ExperimentData also exposes agentPolicyVersion, saLambda, saPSignal and agentSeed as columns. Practice is labeled scripted-practice.

Validation: four scripted practice trials and all 16 formal maps through the game state manager; exact action and belief parity with the experiment model at identical seeds; XLSX serialize/reopen checks; legal-turn, scripted-route, Drive transport/upsert and local storage/retry tests. A synthetic SA_RELEASE_TEST_20261104 upload to the live Drive service confirmed revisions 1 and 2 updated the same file ID in Stag Hunt. This is an automated integration test, not a new human participant or a manual 21-trial browser session.

Drive verification file: 12igMFfVbyVEzxjSFLEikOt8af5z4rZjP. No prior participant files were modified.

## 2026-11-05: cross-trial reset fix

The live game reuses its trialData object. SA previously reset by object identity, so later rounds could reuse an earlier map, seed and beliefs, causing invalid actions or an apparent goal lock. Reset now checks the unique trialId; observation callbacks also check trialId. SA metadata and belief-update arrays are cleared at trial initialization. Policy parameters are unchanged. Earlier SA sessions require review for cross-trial contamination; this fix does not rewrite collected data.

Regression coverage now reuses the same game state manager and SA wrapper across all four practice and sixteen formal maps (the earlier test incorrectly constructed a new manager every trial). The pre-fix run fails with 'DP player outside walkable map'; the fixed run passes, including a separate independent-movement test after the human reaches a goal and XLSX round trips.
