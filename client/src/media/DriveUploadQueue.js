const DB_NAME = 'gridworld-study-uploads';
const STORE_NAME = 'pending-video';

class IndexedDbBlobStore {
  constructor() {
    this.dbPromise = null;
    this.memory = new Map();
  }

  open() {
    if (!window.indexedDB) return Promise.resolve(null);
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(error => {
      console.warn('IndexedDB unavailable; upload retry will be memory-only.', error);
      return null;
    });
    return this.dbPromise;
  }

  async run(mode, operation) {
    const db = await this.open();
    if (!db) return operation(null, this.memory);
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = operation(store, null);
      if (request) {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } else {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      }
    });
  }

  put(record) {
    return this.run('readwrite', (store, memory) => memory ? memory.set(record.id, record) : store.put(record));
  }

  delete(id) {
    return this.run('readwrite', (store, memory) => memory ? memory.delete(id) : store.delete(id));
  }

  getAll() {
    return this.run('readonly', (store, memory) => memory ? [...memory.values()] : store.getAll());
  }
}

export class DriveUploadQueue {
  constructor({ client, sessionId, maxRetries = 5 } = {}) {
    this.client = client;
    this.sessionId = sessionId;
    this.maxRetries = maxRetries;
    this.store = new IndexedDbBlobStore();
    this.queue = [];
    this.queuedIds = new Set();
    this.processingPromise = null;
    this.lastError = null;
  }

  async restore() {
    const records = await this.store.getAll();
    records.filter(record => record.sessionId === this.sessionId).forEach(record => this.addRecord(record));
    this.process();
  }

  addRecord(record) {
    if (this.queuedIds.has(record.id)) return;
    this.queuedIds.add(record.id);
    this.queue.push(record);
  }

  async enqueue(blob, metadata) {
    const id = `${this.sessionId}:${metadata.label}:${metadata.sequence}`;
    const record = { id, sessionId: this.sessionId, blob, metadata, attempts: 0 };
    await this.store.put(record);
    this.addRecord(record);
    return this.process();
  }

  process() {
    if (this.processingPromise) return this.processingPromise;
    this.processingPromise = (async () => {
      while (this.queue.length) {
        const record = this.queue[0];
        let uploaded = false;
        for (let attempt = record.attempts; attempt < this.maxRetries; attempt++) {
          try {
            await this.client.uploadVideo(record.blob, record.metadata);
            uploaded = true;
            this.lastError = null;
            break;
          } catch (error) {
            this.lastError = error;
            record.attempts = attempt + 1;
            await this.store.put(record);
            await new Promise(resolve => setTimeout(resolve, Math.min(1000 * (2 ** attempt), 15000)));
          }
        }
        if (!uploaded) throw this.lastError || new Error('Video upload failed.');
        await this.store.delete(record.id);
        this.queue.shift();
        this.queuedIds.delete(record.id);
      }
    })().finally(() => {
      this.processingPromise = null;
    });
    return this.processingPromise;
  }

  async flush() {
    await this.process();
    if (this.queue.length || this.lastError) throw this.lastError || new Error('Video uploads remain pending.');
  }

  get pendingCount() {
    return this.queue.length;
  }
}
