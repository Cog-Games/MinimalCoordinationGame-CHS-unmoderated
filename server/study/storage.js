import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import { google } from 'googleapis';

const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

const checksum = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

const safeFileName = value => String(value || 'file')
  .replace(/[^a-zA-Z0-9._-]/g, '_')
  .slice(0, 160);

class LocalStudyStorage {
  constructor({ root = process.env.STUDY_LOCAL_STORAGE_DIR || path.resolve('data', 'study-test') } = {}) {
    this.root = root;
    this.mode = 'local';
  }

  async init() {
    await fs.mkdir(this.root, { recursive: true });
    console.warn(`[study] Using local test storage at ${this.root}. Do not use this mode on Render.`);
  }

  async createSessionFolders(sessionId) {
    const sessionRoot = path.join(this.root, safeFileName(sessionId));
    const folders = {
      permission: path.join(sessionRoot, 'permission'),
      video: path.join(sessionRoot, 'video'),
      behavior: path.join(sessionRoot, 'behavior'),
      questionnaire: path.join(sessionRoot, 'questionnaire')
    };
    await Promise.all(Object.values(folders).map(folder => fs.mkdir(folder, { recursive: true })));
    return { root: sessionRoot, folders };
  }

  async writeFile({ folderId, name, mimeType, data }) {
    const fileName = safeFileName(name);
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const filePath = path.join(folderId, fileName);
    await fs.writeFile(filePath, buffer);
    return {
      id: filePath,
      name: fileName,
      mimeType,
      size: buffer.length,
      checksum: checksum(buffer),
      webViewLink: null
    };
  }

  async deleteSession(storageFolderId) {
    if (!storageFolderId || !storageFolderId.startsWith(this.root)) return;
    await fs.rm(storageFolderId, { recursive: true, force: true });
  }

  async deleteFile(storageFileId) {
    if (!storageFileId || !storageFileId.startsWith(this.root)) return;
    await fs.rm(storageFileId, { force: true });
  }
}

class GoogleDriveStudyStorage {
  constructor() {
    this.mode = 'google-drive';
    this.baseFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    this.drive = null;
  }

  async init() {
    if (!this.baseFolderId) {
      throw new Error('GOOGLE_DRIVE_FOLDER_ID is required when STUDY_STORAGE_MODE=google-drive');
    }

    let auth;
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive']
      });
    } else {
      const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
      if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
        throw new Error(
          'Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN for a current My Drive, ' +
          'or GOOGLE_SERVICE_ACCOUNT_JSON for a Shared Drive.'
        );
      }
      const oauth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
      oauth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
      auth = oauth;
    }

    this.drive = google.drive({ version: 'v3', auth });
    await this.drive.files.get({ fileId: this.baseFolderId, fields: 'id,name,mimeType', supportsAllDrives: true });
    console.log('[study] Google Drive storage initialized.');
  }

  async createFolder(name, parentId) {
    const response = await this.drive.files.create({
      requestBody: {
        name: safeFileName(name),
        mimeType: FOLDER_MIME_TYPE,
        parents: [parentId]
      },
      fields: 'id,name',
      supportsAllDrives: true
    });
    return response.data.id;
  }

  async createSessionFolders(sessionId) {
    const root = await this.createFolder(sessionId, this.baseFolderId);
    const entries = await Promise.all(
      ['permission', 'video', 'behavior', 'questionnaire'].map(async name => [name, await this.createFolder(name, root)])
    );
    return { root, folders: Object.fromEntries(entries) };
  }

  async writeFile({ folderId, name, mimeType, data }) {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const response = await this.drive.files.create({
      requestBody: {
        name: safeFileName(name),
        parents: [folderId]
      },
      media: {
        mimeType: mimeType || 'application/octet-stream',
        body: Readable.from(buffer)
      },
      fields: 'id,name,mimeType,size,md5Checksum,webViewLink',
      supportsAllDrives: true
    });
    return {
      id: response.data.id,
      name: response.data.name,
      mimeType: response.data.mimeType,
      size: Number(response.data.size || buffer.length),
      checksum: checksum(buffer),
      providerChecksum: response.data.md5Checksum || null,
      webViewLink: response.data.webViewLink || null
    };
  }

  async deleteSession(storageFolderId) {
    if (!storageFolderId) return;
    await this.drive.files.delete({ fileId: storageFolderId, supportsAllDrives: true });
  }

  async deleteFile(storageFileId) {
    if (!storageFileId) return;
    await this.drive.files.delete({ fileId: storageFileId, supportsAllDrives: true });
  }
}

export async function createStudyStorage() {
  const mode = String(process.env.STUDY_STORAGE_MODE || 'local').toLowerCase();
  const storage = mode === 'google-drive' ? new GoogleDriveStudyStorage() : new LocalStudyStorage();
  await storage.init();
  return storage;
}

export { safeFileName, checksum };
