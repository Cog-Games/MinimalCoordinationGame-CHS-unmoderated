# Practice transition screens

Continue from `codex/museum-default-entry` (the GitHub Pages deployment branch).
Pull this branch before editing. The two transition screens are video-only
instruction screens (`renderVideoInstruction` in `client/src/timeline/TimelineManager.js`),
like the other Stag Hunt videos: playback is locked, and the green Continue
button appears when the video ends.

| Stage | When | Instructions key | Video |
|---|---|---|---|
| `practice_guidance_intro` | Before guided practice | `StagHunt_practice_intro` | `client/public/practice instructions.mp4` |
| `free_choice_intro` | After comprehension, before matchmaking | `StagHunt_free_choice_intro` | `client/public/game instructions.mp4` |

Avoid MP4s with long silent video tracks: the old reward clips had 62-second video tracks despite only 3–5 seconds of audio.

## Local verification

`/?practiceFlowTest=true&ai=rl_joint` on localhost runs the practice introduction,
four guided rounds, comprehension check, free-choice transition, matchmaking,
and one main-task round. The test shortcut is localhost-only.

Keep the fixed practice order and the 9-second matchmaking wait with the hidden
double-Enter shortcut. Do not change main-task planning parameters or storage configuration.
