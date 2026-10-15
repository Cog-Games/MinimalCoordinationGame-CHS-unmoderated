# AI-only GitHub Pages deployment

Build with `npm run build:pages`. The `codex/pages-ai-drive` workflow publishes to `gh-pages`. The browser runs the discounted joint DP agent without an embedded API key.

Game: https://cog-games.github.io/MinimalCoordinationGame-CHS-unmoderated/

## One Excel workbook per session

Deployed on 2026-10-15: Apps Script web-app version 5, with Advanced Drive v3 enabled. The existing endpoint and access settings are preserved. New uploads go to the private Stag Hunt folder:
https://drive.google.com/drive/folders/1N2Ko4FmapcRfLxP2OFVOF03M2K06AO_Z

Each session creates `cake_<sessionId>.xlsx` once. Subsequent checkpoints and completion replace its contents using Drive.Files.update, preserving the file ID and link. Revision and completion status are recorded inside the workbook and in file appProperties. ScriptLock serializes writes. Duplicate revisions are acknowledged without another file; stale revisions cannot overwrite newer data. Conflicting content at the same revision is rejected, as is replacement of a completed session by a later in-progress snapshot. Session write tokens are hashed in Drive metadata and excluded from exported backups and workbooks.

The frontend checks `cake-session-upsert-v1` support before upload and requires a matching acknowledgement with session ID, revision, filename and file ID before showing Saved to Google Drive. Reload an old open game page before beginning a new session to load this protocol. Historical files in testExp1 are unchanged; this deployment does not consolidate or delete them.

## Workbook and local backup

The workbook retains the legacy analysis columns and includes Session, Trials, events, AI decisions, comprehension, questionnaire, overflow and RawJSON data. To recover the full snapshot, concatenate column B of RawJSON excluding its header, base64-decode, then parse UTF-8 JSON. Large values are split to respect Excel cell limits.

IndexedDB is the first save destination. Failed cloud uploads remain pending and retry while the page is open and on later visits to the same origin. Download backup exports JSON without write tokens. Local backup means browser storage on that device and origin; it is not an automatic file in the Downloads folder. Static hosting does not resume gameplay after refresh. Wait for Saved to Google Drive before closing; page-exit delivery is best effort.

Solo practice hides the three reward boxes and chef labels, retaining Cowlie. Paired practice and main rounds retain rewards. Questionnaire answers are checkpointed individually.

## Validation completed on 2026-10-15

- `npm run test:drive`: exporter, protocol validation and simulated Apps Script upsert checks passed. `npm run test:storage`: local-first storage and retry checks passed. Pages build passed.
- `scripts/verify-live-drive-upsert.mjs --live` uploaded synthetic revisions 1, 2, duplicate 2, completed 3 and stale 1. All five acknowledgements returned the same file ID with the expected dispositions.
- Downloaded the final workbook from Drive and audited 21 trials, 744 events, 139 DP decisions, four comprehension records including a retry, and three final questionnaire answers. The recovered RawJSON exactly matched the submitted final snapshot. This reused the earlier synthetic 21-round session as a storage fixture; it was not another manual 21-round gameplay run.
- `client/storage-validation.html` exercised the actual browser store and transport: initial upload, simulated offline checkpoint, recovery, completion, local export and full-page reload all passed. Local revision 3 remained complete and acknowledged after reload.
- The published Pages game displayed Saved to Google Drive. A later automatic checkpoint retained its file ID. The destination contained four test sessions and exactly four Excel files, with no duplicate session filenames.

Local evidence is under `output/session-upsert-validation/`, including cloud acknowledgements, downloaded workbook, audit report, expected snapshot, reloaded local backup and screenshots. Test data is labeled TEST/validationOnly where supported and is not participant data.

The storage validation page runs only through the development server and is not a Vite production entry. It writes synthetic test sessions to the configured live Drive endpoint when its Run button is pressed. The live verification script also requires explicit `--live`. Do not use real participant snapshots as test fixtures.

## Museum intake and labelled filenames (2026-10-15)

On `codex/museum-default-entry`, the bare URL defaults to in-person sessions; `?setting=museum` also selects this mode. This retains DOB and replaces parent email with a required participant index (for example M001). Indices are normalized to uppercase and allow letters, digits, hyphens and underscores, up to 40 characters. Use `?setting=remote` for the parent-email entry. Both modes export `studySetting` and `participantIndex` alongside existing participant fields.

Apps Script version 6 accepts a filename label while still looking up files by session ID. Once intake is submitted, the existing session workbook is renamed to `cake_M001_<sessionId>.xlsx` or `cake_parent@example.com_<sessionId>.xlsx`. Unsupported filename characters are replaced with underscores. The session suffix distinguishes separate visits with the same index/email. Older revisions cannot rename newer files. Existing historical files are unchanged unless their active session sends a newer snapshot.


## Museum-default branch deployment

`codex/museum-default-entry` is a source branch prepared for manual deployment by the study owner. Pushing it does not trigger the existing workflow, whose automatic trigger remains `codex/pages-ai-drive`. To publish this branch, run **Deploy to GitHub Pages** manually in GitHub Actions and select `codex/museum-default-entry`. The workflow builds with `npm run build:pages` and publishes the output to `gh-pages`. Keep Pages configured to serve `gh-pages` at `/ (root)`; do not point Pages directly at the source branch.

After deployment, the bare game URL opens museum intake. Append `?setting=remote` for email intake. Both retain the existing one-workbook-per-session Drive service.
