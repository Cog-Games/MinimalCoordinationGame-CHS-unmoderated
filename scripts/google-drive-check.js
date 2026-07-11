import 'dotenv/config';
import { google } from 'googleapis';

const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
if (!folderId) throw new Error('Set GOOGLE_DRIVE_FOLDER_ID in .env first.');

let auth;
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
    scopes: ['https://www.googleapis.com/auth/drive']
  });
} else {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in .env first.');
  }
  const oauth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  oauth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  auth = oauth;
}

const drive = google.drive({ version: 'v3', auth });
const response = await drive.files.get({
  fileId: folderId,
  supportsAllDrives: true,
  fields: 'id,name,mimeType,driveId,trashed,capabilities(canAddChildren,canDelete,canEdit)'
});
const folder = response.data;
if (folder.mimeType !== 'application/vnd.google-apps.folder') {
  throw new Error('GOOGLE_DRIVE_FOLDER_ID does not identify a folder.');
}
if (folder.trashed) throw new Error('The configured Google Drive folder is in the trash.');
if (!folder.capabilities?.canAddChildren) {
  throw new Error('The authorized Google account cannot upload into this folder.');
}

console.log(JSON.stringify({
  ok: true,
  folderId: folder.id,
  folderName: folder.name,
  location: folder.driveId ? 'shared-drive' : 'my-drive',
  canUpload: Boolean(folder.capabilities?.canAddChildren),
  canDelete: Boolean(folder.capabilities?.canDelete),
  canEdit: Boolean(folder.capabilities?.canEdit)
}, null, 2));
