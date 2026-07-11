import { Pool } from 'pg';

const nowIso = () => new Date().toISOString();
const collectionClosedStatuses = new Set([
  'complete_pending_review', 'approved', 'excluded', 'needs_followup', 'withdrawal_requested',
  'withdrawal_video_deleted', 'withdrawn', 'assent_declined'
]);

export class StudySessionStore {
  constructor({ connectionString = process.env.DATABASE_URL } = {}) {
    this.pool = connectionString
      ? new Pool({
          connectionString,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
        })
      : null;
    this.sessions = new Map();
    this.artifacts = new Map();
    this.reviews = new Map();
  }

  async init() {
    if (!this.pool) {
      console.warn('[study] DATABASE_URL is not set; using an in-memory session registry for local testing.');
      return;
    }

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id UUID PRIMARY KEY,
        access_token_hash TEXT NOT NULL,
        status TEXT NOT NULL,
        condition TEXT NOT NULL,
        participant_code TEXT,
        storage_folder_id TEXT,
        storage_folders JSONB NOT NULL DEFAULT '{}'::jsonb,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ,
        withdrawn_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS study_artifacts (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL REFERENCES study_sessions(id) ON DELETE CASCADE,
        kind TEXT NOT NULL,
        sequence INTEGER NOT NULL DEFAULT 0,
        file_name TEXT NOT NULL,
        storage_file_id TEXT NOT NULL,
        mime_type TEXT,
        size_bytes BIGINT,
        checksum TEXT,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(session_id, kind, sequence)
      );

      CREATE TABLE IF NOT EXISTS study_reviews (
        session_id UUID PRIMARY KEY REFERENCES study_sessions(id) ON DELETE CASCADE,
        decision TEXT NOT NULL,
        reviewer TEXT,
        review_data JSONB NOT NULL DEFAULT '{}'::jsonb,
        reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  artifactKey(sessionId, kind, sequence = 0) {
    return `${sessionId}:${kind}:${Number(sequence) || 0}`;
  }

  async createSession(session) {
    const record = {
      ...session,
      status: session.status || 'created',
      storageFolders: session.storageFolders || {},
      metadata: session.metadata || {},
      createdAt: session.createdAt || nowIso(),
      updatedAt: nowIso(),
      completedAt: null,
      withdrawnAt: null
    };

    if (!this.pool) {
      this.sessions.set(record.id, record);
      return record;
    }

    const result = await this.pool.query(
      `INSERT INTO study_sessions
        (id, access_token_hash, status, condition, participant_code, storage_folder_id, storage_folders, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)
       RETURNING *`,
      [
        record.id,
        record.accessTokenHash,
        record.status,
        record.condition,
        record.participantCode || null,
        record.storageFolderId || null,
        JSON.stringify(record.storageFolders),
        JSON.stringify(record.metadata)
      ]
    );
    return this.fromSessionRow(result.rows[0]);
  }

  async getSession(id) {
    if (!this.pool) return this.sessions.get(id) || null;
    const result = await this.pool.query('SELECT * FROM study_sessions WHERE id = $1', [id]);
    return result.rows[0] ? this.fromSessionRow(result.rows[0]) : null;
  }

  async updateSession(id, patch = {}) {
    const current = await this.getSession(id);
    if (!current) return null;
    const next = {
      ...current,
      ...patch,
      metadata: { ...(current.metadata || {}), ...(patch.metadata || {}) },
      updatedAt: nowIso()
    };

    if (!this.pool) {
      this.sessions.set(id, next);
      return next;
    }

    const result = await this.pool.query(
      `UPDATE study_sessions SET
        status = $2,
        storage_folder_id = $3,
        storage_folders = $4::jsonb,
        metadata = $5::jsonb,
        updated_at = NOW(),
        completed_at = $6,
        withdrawn_at = $7
       WHERE id = $1
       RETURNING *`,
      [
        id,
        next.status,
        next.storageFolderId || null,
        JSON.stringify(next.storageFolders || {}),
        JSON.stringify(next.metadata || {}),
        next.completedAt || null,
        next.withdrawnAt || null
      ]
    );
    return this.fromSessionRow(result.rows[0]);
  }

  async updateCollectionStatus(id, status) {
    if (!this.pool) {
      const current = this.sessions.get(id);
      if (!current || collectionClosedStatuses.has(current.status)) return current || null;
      const next = { ...current, status, updatedAt: nowIso() };
      this.sessions.set(id, next);
      return next;
    }
    const result = await this.pool.query(
      `UPDATE study_sessions
       SET status = $2, updated_at = NOW()
       WHERE id = $1
         AND status NOT IN ('complete_pending_review', 'approved', 'excluded', 'needs_followup', 'withdrawal_requested', 'withdrawal_video_deleted', 'withdrawn', 'assent_declined')
       RETURNING *`,
      [id, status]
    );
    if (result.rows[0]) return this.fromSessionRow(result.rows[0]);
    return this.getSession(id);
  }

  async findArtifact(sessionId, kind, sequence = 0) {
    const key = this.artifactKey(sessionId, kind, sequence);
    if (!this.pool) return this.artifacts.get(key) || null;
    const result = await this.pool.query(
      'SELECT * FROM study_artifacts WHERE session_id = $1 AND kind = $2 AND sequence = $3',
      [sessionId, kind, Number(sequence) || 0]
    );
    return result.rows[0] ? this.fromArtifactRow(result.rows[0]) : null;
  }

  async recordArtifact(artifact) {
    const record = {
      ...artifact,
      sequence: Number(artifact.sequence) || 0,
      metadata: artifact.metadata || {},
      createdAt: artifact.createdAt || nowIso()
    };
    const key = this.artifactKey(record.sessionId, record.kind, record.sequence);

    if (!this.pool) {
      this.artifacts.set(key, record);
      return record;
    }

    const result = await this.pool.query(
      `INSERT INTO study_artifacts
        (id, session_id, kind, sequence, file_name, storage_file_id, mime_type, size_bytes, checksum, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb)
       ON CONFLICT (session_id, kind, sequence) DO UPDATE SET
        file_name = EXCLUDED.file_name,
        storage_file_id = EXCLUDED.storage_file_id,
        mime_type = EXCLUDED.mime_type,
        size_bytes = EXCLUDED.size_bytes,
        checksum = EXCLUDED.checksum,
        metadata = EXCLUDED.metadata
       RETURNING *`,
      [
        record.id,
        record.sessionId,
        record.kind,
        record.sequence,
        record.fileName,
        record.storageFileId,
        record.mimeType || null,
        record.sizeBytes ?? null,
        record.checksum || null,
        JSON.stringify(record.metadata)
      ]
    );
    return this.fromArtifactRow(result.rows[0]);
  }

  async listArtifacts(sessionId) {
    if (!this.pool) {
      return [...this.artifacts.values()].filter(item => item.sessionId === sessionId);
    }
    const result = await this.pool.query(
      'SELECT * FROM study_artifacts WHERE session_id = $1 ORDER BY created_at, sequence',
      [sessionId]
    );
    return result.rows.map(row => this.fromArtifactRow(row));
  }

  async markArtifactDeleted(artifact, deletedAt) {
    const metadata = { ...(artifact.metadata || {}), deletedAt };
    if (!this.pool) {
      const record = { ...artifact, metadata };
      this.artifacts.set(this.artifactKey(artifact.sessionId, artifact.kind, artifact.sequence), record);
      return record;
    }
    const result = await this.pool.query(
      `UPDATE study_artifacts SET metadata = $2::jsonb WHERE id = $1 RETURNING *`,
      [artifact.id, JSON.stringify(metadata)]
    );
    return this.fromArtifactRow(result.rows[0]);
  }

  async listSessions() {
    if (!this.pool) return [...this.sessions.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const result = await this.pool.query('SELECT * FROM study_sessions ORDER BY created_at DESC');
    return result.rows.map(row => this.fromSessionRow(row));
  }

  async findSessionByWithdrawalTokenHash(tokenHash) {
    if (!this.pool) {
      return [...this.sessions.values()].find(
        session => session.metadata?.withdrawalTokenHash === tokenHash
      ) || null;
    }
    const result = await this.pool.query(
      `SELECT * FROM study_sessions
       WHERE metadata->>'withdrawalTokenHash' = $1
       LIMIT 1`,
      [tokenHash]
    );
    return result.rows[0] ? this.fromSessionRow(result.rows[0]) : null;
  }

  async recordReview(sessionId, review) {
    const record = { sessionId, ...review, reviewedAt: nowIso() };
    if (!this.pool) {
      this.reviews.set(sessionId, record);
      return record;
    }
    const result = await this.pool.query(
      `INSERT INTO study_reviews (session_id, decision, reviewer, review_data)
       VALUES ($1, $2, $3, $4::jsonb)
       ON CONFLICT (session_id) DO UPDATE SET
         decision = EXCLUDED.decision,
         reviewer = EXCLUDED.reviewer,
         review_data = EXCLUDED.review_data,
         reviewed_at = NOW()
       RETURNING *`,
      [sessionId, review.decision, review.reviewer || null, JSON.stringify(review.reviewData || {})]
    );
    return {
      sessionId: result.rows[0].session_id,
      decision: result.rows[0].decision,
      reviewer: result.rows[0].reviewer,
      reviewData: result.rows[0].review_data,
      reviewedAt: result.rows[0].reviewed_at
    };
  }

  fromSessionRow(row) {
    return {
      id: row.id,
      accessTokenHash: row.access_token_hash,
      status: row.status,
      condition: row.condition,
      participantCode: row.participant_code,
      storageFolderId: row.storage_folder_id,
      storageFolders: row.storage_folders || {},
      metadata: row.metadata || {},
      createdAt: row.created_at?.toISOString?.() || row.created_at,
      updatedAt: row.updated_at?.toISOString?.() || row.updated_at,
      completedAt: row.completed_at?.toISOString?.() || row.completed_at,
      withdrawnAt: row.withdrawn_at?.toISOString?.() || row.withdrawn_at
    };
  }

  fromArtifactRow(row) {
    return {
      id: row.id,
      sessionId: row.session_id,
      kind: row.kind,
      sequence: row.sequence,
      fileName: row.file_name,
      storageFileId: row.storage_file_id,
      mimeType: row.mime_type,
      sizeBytes: row.size_bytes === null ? null : Number(row.size_bytes),
      checksum: row.checksum,
      metadata: row.metadata || {},
      createdAt: row.created_at?.toISOString?.() || row.created_at
    };
  }
}
