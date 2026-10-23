# Transition audio follow-up

Continue from `codex/museum-default-entry` (the GitHub Pages deployment branch).
Pull this branch before editing. The two transition screens currently have text only.
They are rendered by `showPracticeChoiceInstructions(freeChoice)` in
`client/src/timeline/TimelineManager.js`.

## Before guided practice

“For the next four practice rounds, we will tell you and the other chef which oven to go to. Follow the arrow to your oven. After practice, you can choose for yourself.”

## After comprehension, before matchmaking

“Practice is finished! Now you’ll play with another chef. In the next games, you and the other chef can each choose which oven to go to. There will be no arrows telling you where to go.”

Add audio-only recordings under `client/public/` and load them using `this.assetUrl(...)`.
Stop playback when leaving the screen; handle rejected autoplay without blocking the Continue button.
Avoid using MP4s with long silent video tracks: the old reward clips had 62-second video tracks despite only 3–5 seconds of audio.

## Local verification

`/?practiceFlowTest=true&ai=rl_joint` on localhost runs the practice introduction,
four guided rounds, comprehension check, free-choice transition, matchmaking,
and one main-task round. The test shortcut is localhost-only.

Keep the fixed practice order and the 9-second matchmaking wait with the hidden
double-Enter shortcut. Do not change main-task planning parameters or storage configuration.
