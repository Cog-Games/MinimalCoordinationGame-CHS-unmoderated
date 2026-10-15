// Raw snapshots are authoritative; workbook exports are derived views.
export const SCHEMA_VERSION = '3.0.0';
export const jsonClone = value => JSON.parse(JSON.stringify(value, (_key, item) => item instanceof Set ? [...item] : item));
export const newId = () => {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes); // also supported on plain HTTP LAN origins
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
};

export class IndexedSnapshotStore {
  async database() {
    if (!this.db) this.db = new Promise((resolve, reject) => {
      const request = indexedDB.open('cake-research-data-v3', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('sessions', { keyPath: 'sessionId' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.db;
  }
  async run(mode, operation) {
    const db = await this.database();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', mode);
      const request = operation(tx.objectStore('sessions'));
      tx.oncomplete = () => resolve(request?.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Local save aborted'));
    });
  }
  async put(record) {
    const db = await this.database();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sessions', 'readwrite');
      const store = tx.objectStore('sessions');
      const get = store.get(record.sessionId);
      get.onsuccess = () => {
        const existing = get.result;
        // Multiple tabs may recover the same session. Never roll back its revision/ack.
        if (!existing || existing.revision < record.revision ||
            (existing.revision === record.revision && existing.pending)) store.put(record);
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Local save aborted'));
    });
  }
  all() { return this.run('readonly', store => store.getAll()); }
}

export class ResearchDataStore {
  constructor({ endpoint, local = new IndexedSnapshotStore(), fetchImpl = (...args) => fetch(...args), onStatus = () => {} } = {}) {
    this.endpoint = endpoint;
    this.local = local;
    this.fetchImpl = fetchImpl;
    this.onStatus = onStatus;
    this.sessionId = newId();
    this.writeToken = newId();
    this.revision = 0;
    this.queue = Promise.resolve();
    this.memory = new Map();
  }
  // Capture immediately; serialize local writes so old snapshots cannot replace new ones.
  save(snapshot) {
    const record = {
      sessionId: this.sessionId, writeToken: this.writeToken,
      revision: ++this.revision, endpoint: this.endpoint, pending: true,
      snapshot: jsonClone({ ...snapshot, sessionId: this.sessionId, dataSchemaVersion: SCHEMA_VERSION })
    };
    this.memory.set(record.sessionId, record);
    this.queue = this.queue.catch(() => {}).then(async () => {
      try { await this.local.put(record); this.onStatus('local'); }
      catch (error) { this.onStatus('local-error', error); }
    });
    this.queue.then(() => {
      clearTimeout(this.uploadTimer);
      this.uploadTimer = setTimeout(() => this.flush(), 500);
    });
    return this.queue;
  }
  async flush() {
    if (this.flushing) { this.flushAgain = true; return this.flushing; }
    this.flushing = this.uploadPending();
    try { await this.flushing; }
    finally {
      this.flushing = null;
      if (this.flushAgain) { this.flushAgain = false; void this.flush(); }
    }
  }
  async uploadPending() {
    await this.queue;
    let records = [];
    try { records = await this.local.all(); } catch (error) { this.onStatus('local-error', error); }
    const pending = new Map(records.map(r => [r.sessionId, r]));
    for (const [id, r] of this.memory) if (!pending.has(id) || pending.get(id).revision <= r.revision) pending.set(id, r);
    for (const record of pending.values()) {
      if (!record.pending) continue;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
      try {
        const response = await this.fetchImpl(record.endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: record.sessionId, writeToken: record.writeToken, revision: record.revision, snapshot: record.snapshot }),
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`Save returned HTTP ${response.status}`);
        const ack = await response.json();
        if (ack.sessionId !== record.sessionId || ack.revision !== record.revision || ack.saved !== true) throw new Error('Invalid save confirmation');
        // Ack a revision only if it is still the latest locally. Serialize against save().
        this.queue = this.queue.catch(() => {}).then(async () => {
          const latest = this.memory.get(record.sessionId);
          if (latest && latest.revision > record.revision) return;
          const saved = { ...record, pending: false, acknowledgedAt: ack.savedAt, remoteFileId: ack.fileId || null };
          this.memory.set(record.sessionId, saved);
          try { await this.local.put(saved); } catch (error) { this.onStatus('local-error', error); }
          this.onStatus('server', ack);
        });
        await this.queue;
      } catch (error) { this.onStatus('pending', error); }
      finally { clearTimeout(timeout); }
    }
  }
  async exportLocal() {
    await this.queue;
    let records = [];
    try { records = await this.local.all(); } catch (_) { /* memory fallback */ }
    const combined = new Map(records.map(r => [r.sessionId, r]));
    for (const [id, r] of this.memory) if (!combined.has(id) || combined.get(id).revision <= r.revision) combined.set(id, r);
    // Never expose write capabilities in downloaded research files.
    return [...combined.values()].map(({ snapshot, revision, pending, acknowledgedAt, remoteFileId }) => ({ ...snapshot, revision, pending, acknowledgedAt, remoteFileId }));
  }
}
