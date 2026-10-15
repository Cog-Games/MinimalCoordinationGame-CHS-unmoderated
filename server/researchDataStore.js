import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash, timingSafeEqual, randomUUID } from 'node:crypto';

const digest = text => createHash('sha256').update(text).digest('hex');
const validId = value => typeof value === 'string' && /^[a-f0-9]{32}$/.test(value);

export function researchDataHandler(directory) {
  const queues = new Map();
  return async (req, res) => {
    const { sessionId, writeToken, revision, snapshot } = req.body || {};
    if (!validId(sessionId) || !validId(writeToken) || !Number.isSafeInteger(revision) || revision < 1 || !snapshot || snapshot.sessionId !== sessionId || snapshot.dataSchemaVersion !== '3.0.0' || !Array.isArray(snapshot.allTrialsData)) {
      return res.status(400).json({ error: 'Invalid research snapshot' });
    }
    const previous = queues.get(sessionId) || Promise.resolve();
    const operation = previous.catch(() => {}).then(async () => {
      const folder = path.join(directory, sessionId);
      await fs.mkdir(folder, { recursive: true, mode: 0o700 });
      const tokenFile = path.join(folder, 'write-token.sha256');
      const tokenHash = digest(writeToken);
      try { await fs.writeFile(tokenFile, tokenHash, { flag: 'wx', mode: 0o600 }); }
      catch (error) { if (error.code !== 'EEXIST') throw error; }
      const storedHash = await fs.readFile(tokenFile, 'utf8');
      if (storedHash.length !== tokenHash.length || !timingSafeEqual(Buffer.from(storedHash), Buffer.from(tokenHash))) {
        return res.status(403).json({ error: 'Invalid write token' });
      }
      const filename = path.join(folder, `${String(revision).padStart(9, '0')}.json`);
      const payloadHash = digest(JSON.stringify(snapshot));
      try {
        const existing = JSON.parse(await fs.readFile(filename, 'utf8'));
        if (existing.payloadHash !== payloadHash) return res.status(409).json({ error: 'Revision conflict' });
        return res.json({ saved: true, sessionId, revision, savedAt: existing.savedAt });
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
      const savedAt = new Date().toISOString();
      const temp = `${filename}.${randomUUID()}.tmp`;
      let handle;
      try {
        handle = await fs.open(temp, 'wx', 0o600);
        await handle.writeFile(JSON.stringify({ sessionId, revision, savedAt, payloadHash, snapshot }));
        await handle.sync();
        await handle.close(); handle = null;
        await fs.rename(temp, filename);
        const dir = await fs.open(folder, 'r');
        try { await dir.sync(); } finally { await dir.close(); }
      } finally {
        if (handle) await handle.close();
        await fs.unlink(temp).catch(() => {});
      }
      res.json({ saved: true, sessionId, revision, savedAt });
    });
    queues.set(sessionId, operation);
    try { await operation; }
    catch (error) {
      console.error('Research snapshot save failed:', error.code || error.message);
      if (!res.headersSent) res.status(500).json({ error: 'Data was not saved; retry required' });
    } finally { if (queues.get(sessionId) === operation) queues.delete(sessionId); }
  };
}
