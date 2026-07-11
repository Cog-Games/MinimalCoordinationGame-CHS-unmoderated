# Self-hosted study test setup

This implementation is a technical testing scaffold. Replace the permission and assent text with the exact IRB-approved language before collecting research data.

## What is implemented

- Parent permission data saved separately from behavioral data.
- Guardian consent video and a randomized child-presence check.
- Continuous gameplay recording in independent 30-second segments.
- IndexedDB-backed retry queue for interrupted video uploads.
- Server-assigned joint/individual RL condition.
- Per-trial behavioral JSON checkpoints and a final consolidated JSON file.
- Google Drive or local-test storage behind one server interface.
- Optional Postgres operational registry, with an in-memory local fallback.
- Withdrawal endpoint that deletes the session folder.
- Parent gameplay-video review with timeline scrubbing, playback-speed controls, and a recorded keep/withdraw decision.
- Researcher-confirmed video deletion that retains behavioral data and an audit record.
- Researcher review page and admin JSON endpoints protected by `STUDY_ADMIN_API_KEY`.

## Local smoke test without Google Drive

1. Copy `.env.example` to `.env`.
2. Keep `STUDY_STORAGE_MODE=local`.
3. Run `npm install` and `npm run dev`.
4. Open `http://localhost:3000/?studyMode=self-paced&testTrials=1`.
5. Test files will appear under `data/study-test/<session-id>/`.

Local storage is deliberately ignored by Git and must not be used on Render.

In local mode, gameplay video blobs remain in the participant browser long enough for the parent to review them immediately after upload completion.

## Test with your current Google Drive

Use OAuth for a personal/current My Drive. The refresh token represents the Google account that owns the test folder.

1. Create a Google Cloud project and enable the Google Drive API.
2. Configure an OAuth consent screen for testing.
3. Create a Web application OAuth client and add `http://localhost:53682/oauth2callback` as an authorized redirect URI.
4. Put `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`, run `npm run drive:oauth`, open the URL it prints, and copy the returned `GOOGLE_REFRESH_TOKEN` into `.env`.
5. Create a dedicated test folder in your Drive and copy the folder ID from its URL.
6. Set:

   ```dotenv
   STUDY_STORAGE_MODE=google-drive
   GOOGLE_DRIVE_FOLDER_ID=...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REFRESH_TOKEN=...
   ```

7. Never place these values in a `VITE_` variable. Vite variables are included in browser code.
8. Run `npm run drive:check`. It performs a read-only check that the folder exists and the authorized account can upload into it.

The browser sends short video segments to the same-origin Render API. The API uploads them into Google Drive using the server-only OAuth credential. This is intentionally optimized for the small test sample; the storage service can later be upgraded to browser-to-cloud resumable uploads without changing the recording or experiment managers.

## Switch later to Duke Shared Drive

1. Create a service account in an institution-approved Google Cloud project.
2. Add the service account as a member of the Duke Shared Drive with only the permissions needed for upload and deletion.
3. Point `GOOGLE_DRIVE_FOLDER_ID` to the approved study folder.
4. Remove the OAuth client/refresh-token variables.
5. Set `GOOGLE_SERVICE_ACCOUNT_JSON` to the service account JSON serialized on one line.
6. Test upload, review access, and permanent deletion with nonparticipant dummy files.

## Render deployment

The included `render.yaml` creates a web service and Postgres database. Before deploying:

- Set `ALLOWED_ORIGINS` to the exact Render/custom-domain origin, for example `https://study.example.edu`.
- Configure the Google Drive environment variables as secrets.
- Use a paid Render web service and paid Postgres instance for real collection.
- Replace all `test-v1` permission and assent versions.
- Confirm the data-retention and withdrawal workflow with the IRB and Duke security/privacy offices.

## Parent review and researcher-managed withdrawal

After all video and behavioral uploads finish and the progress bar reaches 100%, the completion page exposes the gameplay recording held in that browser session. Because gameplay is recorded in short upload-safe files, the preview provides a part selector, previous/next controls, a normal video timeline for scrubbing, automatic progression, and 1×/1.5×/2× playback.

The parent submits either `keep` or `withdraw`, an optional note, and whether they reviewed the recording. Each submission is written as a `parent-decision-####.json` artifact. A withdrawal changes the operational session status to `withdrawal_requested`; it does not automatically delete anything.

The researcher page highlights withdrawal requests. An authenticated researcher must confirm **Delete session videos**, which deletes guardian-consent, liveness, and gameplay video files while retaining behavioral JSON, the parent-decision artifact, and deletion audit metadata. Direct parent deletion links are disabled by default with:

```dotenv
STUDY_ENABLE_DIRECT_DELETION_LINKS=false
```

The preview blobs exist only on the immediate completion page and disappear on refresh. This avoids creating a public or long-lived streaming URL for child video. Confirm the exact retention and researcher-deletion procedure with the IRB before real collection.

## Admin endpoints

Open `/admin.html` on the deployed site for the researcher review page. Enter the configured `STUDY_ADMIN_API_KEY`; it remains in that tab and is sent only as a request header to the same-origin API. The page lists session state, links authorized researchers to each private Drive artifact, and records a review decision.

For scripted use, supply the configured key as `X-Admin-Key`:

- `GET /api/study/admin/sessions`
- `GET /api/study/admin/sessions/:id`
- `POST /api/study/admin/sessions/:id/review`

Example review body:

```json
{
  "decision": "approved",
  "reviewer": "researcher-id",
  "reviewData": {
    "guardianPermissionValid": true,
    "childVisible": true,
    "childParticipated": true,
    "adultAssistance": "technical_only",
    "videoUsable": true
  }
}
```

The admin API returns Drive file IDs and metadata, not public links. Reviewers access files through the authorized Google account that owns or is a member of the Drive.
