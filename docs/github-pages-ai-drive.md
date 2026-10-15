# AI-only GitHub Pages deployment

Build with `npm run build:pages`. The pages-ai-drive branch workflow deploys dist to gh-pages. No API key is embedded: the browser runs the discounted joint DP agent.

The Google Apps Script already configured in gameConfig accepts Excel uploads. GoogleDriveTransport sends CORS requests and requires status=success, the exact requested filename, and a Drive file ID before acknowledging a revision. An opaque response is never treated as saved. The existing destination folder is testExp1 (1d8S_QSY0JrJ0K3Qz3Jn7rNIsedTL7grC).

Each uploaded workbook contains Session metadata, Trials summary, and RawJSON. To recover the complete data (including events, AI decisions, comprehension and questionnaire), concatenate column B of RawJSON excluding its header, base64-decode, then parse UTF-8 JSON. Cells are bounded to 24,000 characters. Filenames contain session and revision; select the greatest revision per session. Retries may create duplicate Drive files with the same filename because the existing service does not provide idempotency; deduplicate by session/revision.

IndexedDB remains the first save destination. Failed uploads stay pending and retry while open and on later visits to this same origin. Download backup produces JSON without write tokens. Do not close before “Saved to Google Drive”; page-exit delivery is best effort. Static hosting does not resume gameplay after refresh.

Solo practice hides the three reward boxes and chef labels, retaining Cowlie. Paired practice and main rounds keep rewards. Questionnaire answers are checkpointed individually.

Validation: test:drive covers complete Unicode snapshot round-trip and ignored/wrong-file response rejection. test:storage covers offline/reload retry and acknowledgement races. Browser CORS upload and Drive readback verified with synthetic test data. No historic participant records are bundled or uploaded by the deployment.


## Pending upgrade: one workbook per session

The `codex/drive-session-upsert` change requires deploying `server/google-apps-script/Code.gs` to the existing Apps Script web app before publishing the frontend. It is not enabled on the live Pages site until that deployment is verified.

Deployment sequence:
1. Open the existing study owner's Apps Script project. Preserve its current source/version before replacing handlers, and check whether unrelated studies share the endpoint.
2. Enable Advanced Drive service v3. The replacement uses the new private `Stag Hunt` folder (`1N2Ko4FmapcRfLxP2OFVOF03M2K06AO_Z`); it does not change sharing or delete historical files.
3. Deploy a new version of the existing web-app deployment, retaining its existing access settings and URL. If Google requests a new authorization grant, the owner must review it.
4. Check GET returns `protocol: cake-session-upsert-v1`. Send a synthetic session revision 1, revision 2, duplicate revision 2, then a completed revision. Confirm every acknowledgement returns the same file ID and that Drive contains exactly one matching workbook. Read back its RawJSON and verify the final revision, all trials, comprehension, and questionnaire.
5. Only after that check, publish the frontend from this change to Pages and verify a browser save and local backup.

The new file name is `cake_<sessionId>.xlsx`; revision and completion state remain inside the workbook. Updates replace binary content with Drive.Files.update, preserving the link. ScriptLock serializes creation/update, and file appProperties store the session, token hash, content hash, revision and completion state in the same write as the workbook. Duplicate revisions are acknowledged without creating or updating a file. Older revisions cannot overwrite newer data. Conflicting data at the same revision is rejected. A completed session cannot be replaced by a newer in-progress snapshot.

The frontend checks the protocol before sending data to avoid accidentally using an old create-only handler. Until the matching service is deployed, it retains pending snapshots locally and reports an upload failure rather than claiming a cloud save. Old published clients use a different protocol; ask participants to finish before the deployment switch, then reload for new sessions. Do not republish the frontend before the backend is ready.

Legacy `_r...xlsx` files remain unchanged. Consolidating them is a separate migration: first identify the greatest complete revision, verify its contents, then archive redundant versions with the owner's approval.

Tests: `npm run test:drive` covers the exporter, protocol check, and the Apps Script handler with a simulated Drive service. This is not a substitute for the live deployment/readback test in step 4. `npm run test:storage` verifies local-first backups and retry behavior.
