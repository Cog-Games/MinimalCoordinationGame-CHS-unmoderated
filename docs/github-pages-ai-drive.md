# AI-only GitHub Pages deployment

Build with `npm run build:pages`. The pages-ai-drive branch workflow deploys dist to gh-pages. No API key is embedded: the browser runs the discounted joint DP agent.

The Google Apps Script already configured in gameConfig accepts Excel uploads. GoogleDriveTransport sends CORS requests and requires status=success, the exact requested filename, and a Drive file ID before acknowledging a revision. An opaque response is never treated as saved. The existing destination folder is testExp1 (1d8S_QSY0JrJ0K3Qz3Jn7rNIsedTL7grC).

Each uploaded workbook contains Session metadata, Trials summary, and RawJSON. To recover the complete data (including events, AI decisions, comprehension and questionnaire), concatenate column B of RawJSON excluding its header, base64-decode, then parse UTF-8 JSON. Cells are bounded to 24,000 characters. Filenames contain session and revision; select the greatest revision per session. Retries may create duplicate Drive files with the same filename because the existing service does not provide idempotency; deduplicate by session/revision.

IndexedDB remains the first save destination. Failed uploads stay pending and retry while open and on later visits to this same origin. Download backup produces JSON without write tokens. Do not close before “Saved to Google Drive”; page-exit delivery is best effort. Static hosting does not resume gameplay after refresh.

Solo practice hides the three reward boxes and chef labels, retaining Cowlie. Paired practice and main rounds keep rewards. Questionnaire answers are checkpointed individually.

Validation: test:drive covers complete Unicode snapshot round-trip and ignored/wrong-file response rejection. test:storage covers offline/reload retry and acknowledgement races. Browser CORS upload and Drive readback verified with synthetic test data. No historic participant records are bundled or uploaded by the deployment.
