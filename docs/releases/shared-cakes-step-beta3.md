# Shared-cake normalized-beta3 agent release

Policy version: `shared-cakes-step-beta3-v1`. Deployment source: `codex/museum-default-entry`.

- Internal joint planner: cost=.30 per actual player move, tau=.10, gamma=.9, horizon=60. Unit-step-cost normalized beta=3.
- SS joint planning reward=5 (previously 10); distinct HH=2, SH/HS=1, same-Hare=1. No displayed movement penalty.
- Applies wherever the enabled StagHunt joint planner runs, including paired practice. This release does not implement guided practice or guarantee practice cooperation.
- Existing displayed/per-player score fields are unchanged: each still records 5 for SS. Do not sum those fields to infer physical shared cake output. Planner reward semantics are explicit in `jointStagReward`.
- Every AI decision records cost, tau, reward parameters, normalization and policyVersion in `dpDecisions`; Excel AgentDecisions payload and RawJSON preserve them. Build metadata also identifies the source commit.
- No changes to intake, maps, timeline, questionnaire, Drive endpoint/service, local backups, or public reports.

## Validation before push

Experimental held-out validation: 3 new seeds × 1000 sessions × 16 maps, 48000 episodes per condition. Candidate P1 CS/AS/AH/CH = 34.623/32.685/32.504/.188%; P2=34.808/32.500/32.533/.158%; no unfinished episodes. Paths with immediate reversal=.864%.

Production-code replay at seed70419327: 1000 sessions ×16 maps. Both-player counts, outcomes, mean cakes, turns and reversal metrics exactly match the experimental result; detailed summary adjacent. All movements legal and payoffs validated by the runner. These are self-play checks, not evidence guaranteeing behavior with children.

Passing tests: shared-cake rewards/config; normalized utility equivalence; historical DP fixtures plus live RLAgent parameter recording; legal joint turns; research storage; Drive transport and one-file upserts; parameter/version round-trip through XLSX/RawJSON. Pages build passed. Storage tests use a local server and mocked Drive transport, not a new live participant session.

No simulation reports or offline demo files are copied into the public game deployment. To roll back, revert this release commit and let the existing Pages workflow publish the previous agent.
