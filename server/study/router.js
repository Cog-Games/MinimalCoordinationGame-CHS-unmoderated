import crypto from 'crypto';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  clearStudySessionCookie,
  createAccessToken,
  hashToken,
  requireAdmin,
  requireStudySession,
  setStudySessionCookie
} from './auth.js';
import { safeFileName } from './storage.js';
import { sendWithdrawalDeletionEmail } from './email.js';

const jsonBuffer = value => Buffer.from(JSON.stringify(value, null, 2), 'utf8');

const mimeExtension = mimeType => {
  const value = String(mimeType || '').toLowerCase();
  if (value.includes('mp4')) return 'mp4';
  if (value.includes('quicktime')) return 'mov';
  return 'webm';
};

const sanitizePermission = body => ({
  permissionVersion: String(body?.permissionVersion || 'test-v1').slice(0, 80),
  agreed: body?.agreed === true,
  recordingAcknowledged: body?.recordingAcknowledged === true,
  parentEmail: String(body?.parentEmail || '').trim().slice(0, 254),
  participantDob: String(body?.participantDob || '').trim().slice(0, 10),
  submittedAt: new Date().toISOString()
});

const publicSession = session => ({
  id: session.id,
  status: session.status,
  condition: session.condition,
  createdAt: session.createdAt,
  completedAt: session.completedAt,
  storageMode: session.metadata?.storageMode || null
});

const closedParticipantStatuses = new Set([
  'complete_pending_review', 'approved', 'excluded', 'needs_followup', 'withdrawal_requested',
  'withdrawal_video_deleted', 'withdrawn', 'assent_declined'
]);

const requireOpenParticipantSession = (session, res) => {
  if (!closedParticipantStatuses.has(session.status)) return true;
  res.status(409).json({ error: 'This study session is no longer open for data collection.' });
  return false;
};

const requireArtifactKinds = async (store, sessionId, kinds, res) => {
  const artifacts = await store.listArtifacts(sessionId);
  const present = new Set(artifacts.map(item => item.kind));
  const missing = kinds.filter(kind => !present.has(kind));
  if (!missing.length) return true;
  res.status(409).json({ error: `Study setup is incomplete (${missing.join(', ')} missing).` });
  return false;
};

const updateCollectionStatusIfOpen = async (store, sessionId, status) => {
  return store.updateCollectionStatus(sessionId, status);
};

const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

const deletionPage = ({ token, expired = false }) => {
  const action = `/api/study/withdraw/${encodeURIComponent(token)}`;
  return `<!doctype html>
  <html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Study withdrawal</title></head>
  <body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#222;padding:24px;">
    <main style="max-width:650px;margin:50px auto;background:#fff;padding:32px;border-radius:12px;box-shadow:0 8px 28px rgba(30,50,80,.13);">
      <h1>Withdraw and delete study data</h1>
      ${expired
        ? '<p>This deletion link is invalid, expired, or has already been used. Contact the research team if you still need help.</p>'
        : `<p>This link is connected to one study session. Confirming will permanently delete its stored videos, permission files, and behavioral data.</p>
           <p><strong>This action cannot be undone.</strong></p>
           <form method="post" action="${action}"><button type="submit" style="padding:13px 20px;border:0;border-radius:8px;background:#b42318;color:#fff;font-size:17px;cursor:pointer;">Permanently delete this study session</button></form>`}
    </main>
  </body></html>`;
};

export function createStudyRouter({ store, storage }) {
  const router = express.Router();
  const directDeletionLinksEnabled = process.env.STUDY_ENABLE_DIRECT_DELETION_LINKS === 'true';
  const maxVideoBytes = Math.max(1, Number(process.env.STUDY_MAX_VIDEO_SEGMENT_MB || 20)) * 1024 * 1024;
  const videoBodyParser = express.raw({
    type: request => String(request.headers['content-type'] || '').startsWith('video/') ||
      String(request.headers['content-type'] || '') === 'application/octet-stream',
    limit: maxVideoBytes
  });

  router.post('/sessions', async (req, res, next) => {
    try {
      const participantCode = String(req.body?.participantCode || '').trim().slice(0, 100) || null;
      const requiredCode = String(process.env.STUDY_TEST_ACCESS_CODE || '').trim();
      if (requiredCode && participantCode !== requiredCode) {
        return res.status(403).json({ error: 'Invalid study access code.' });
      }

      const id = uuidv4();
      const accessToken = createAccessToken();
      const forcedCondition = String(process.env.STUDY_FORCE_CONDITION || '').toLowerCase();
      const condition = ['joint', 'individual'].includes(forcedCondition)
        ? forcedCondition
        : (crypto.randomInt(0, 2) === 0 ? 'joint' : 'individual');
      const storageLayout = await storage.createSessionFolders(id);
      const session = await store.createSession({
        id,
        accessTokenHash: hashToken(accessToken),
        status: 'permission_pending',
        condition,
        participantCode,
        storageFolderId: storageLayout.root,
        storageFolders: storageLayout.folders,
        metadata: { storageMode: storage.mode, studyVersion: process.env.STUDY_VERSION || 'test-v1' }
      });
      setStudySessionCookie(res, id, accessToken);
      res.status(201).json({ session: publicSession(session) });
    } catch (error) {
      next(error);
    }
  });

  router.get('/session', async (req, res, next) => {
    try {
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      res.json({ session: publicSession(session), artifacts: await store.listArtifacts(session.id) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/permission', async (req, res, next) => {
    try {
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      if (!requireOpenParticipantSession(session, res)) return;
      const permission = sanitizePermission(req.body);
      if (!permission.agreed || !permission.recordingAcknowledged) {
        return res.status(400).json({ error: 'Active guardian permission and recording acknowledgement are required.' });
      }
      const existing = await store.findArtifact(session.id, 'permission', 0);
      let artifact = existing;
      if (!existing) {
        const stored = await storage.writeFile({
          folderId: session.storageFolders.permission,
          name: 'guardian-permission.json',
          mimeType: 'application/json',
          data: jsonBuffer({ ...permission, sessionId: session.id })
        });
        artifact = await store.recordArtifact({
          id: uuidv4(), sessionId: session.id, kind: 'permission', sequence: 0,
          fileName: stored.name, storageFileId: stored.id, mimeType: 'application/json',
          sizeBytes: stored.size, checksum: stored.checksum
        });
      }
      const updated = await store.updateSession(session.id, { status: 'permission_recording' });
      res.json({ session: publicSession(updated), artifact });
    } catch (error) {
      next(error);
    }
  });

  router.post('/assent', async (req, res, next) => {
    try {
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      if (!requireOpenParticipantSession(session, res)) return;
      if (!await requireArtifactKinds(store, session.id, ['permission', 'consent-video'], res)) return;
      const assent = {
        assentVersion: String(req.body?.assentVersion || 'test-v1').slice(0, 80),
        childResponse: req.body?.childResponse === 'yes' ? 'yes' : 'no',
        promptId: String(req.body?.promptId || '').slice(0, 80),
        submittedAt: new Date().toISOString()
      };
      if (assent.childResponse !== 'yes') {
        await storage.deleteSession(session.storageFolderId);
        await store.updateSession(session.id, {
          status: 'assent_declined',
          withdrawnAt: new Date().toISOString(),
          storageFolderId: null,
          storageFolders: {}
        });
        clearStudySessionCookie(res);
        return res.status(409).json({ error: 'The child did not assent to participate.' });
      }
      const existing = await store.findArtifact(session.id, 'assent', 0);
      if (!existing) {
        const stored = await storage.writeFile({
          folderId: session.storageFolders.permission,
          name: 'child-assent.json',
          mimeType: 'application/json',
          data: jsonBuffer({ ...assent, sessionId: session.id })
        });
        await store.recordArtifact({
          id: uuidv4(), sessionId: session.id, kind: 'assent', sequence: 0,
          fileName: stored.name, storageFileId: stored.id, mimeType: 'application/json',
          sizeBytes: stored.size, checksum: stored.checksum
        });
      }
      const updated = await store.updateSession(session.id, { status: 'ready' });
      res.json({ session: publicSession(updated) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/video', videoBodyParser, async (req, res, next) => {
    try {
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      if (!requireOpenParticipantSession(session, res)) return;
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'A non-empty video segment is required.' });
      }
      const sequence = Number.parseInt(req.get('x-video-sequence') || '0', 10);
      if (!Number.isInteger(sequence) || sequence < 0 || sequence > 10000) {
        return res.status(400).json({ error: 'Invalid video sequence.' });
      }
      const label = safeFileName(req.get('x-video-label') || 'gameplay');
      const kind = label === 'guardian-consent' ? 'consent-video' :
        (label === 'liveness' ? 'liveness-video' : 'gameplay-video');
      const prerequisites = kind === 'consent-video' ? ['permission'] :
        (kind === 'liveness-video' ? ['permission', 'consent-video', 'assent'] :
          ['permission', 'consent-video', 'assent', 'liveness-video']);
      if (!await requireArtifactKinds(store, session.id, prerequisites, res)) return;
      const existing = await store.findArtifact(session.id, kind, sequence);
      if (existing) return res.json({ artifact: existing, duplicate: true });

      const mimeType = String(req.get('content-type') || 'video/webm').split(';')[0];
      const name = `${label}-${String(sequence).padStart(4, '0')}.${mimeExtension(mimeType)}`;
      const folderId = kind === 'gameplay-video'
        ? session.storageFolders.video
        : session.storageFolders.permission;
      const stored = await storage.writeFile({ folderId, name, mimeType, data: req.body });
      const artifact = await store.recordArtifact({
        id: uuidv4(), sessionId: session.id, kind, sequence,
        fileName: stored.name, storageFileId: stored.id, mimeType,
        sizeBytes: stored.size, checksum: stored.checksum,
        metadata: {
          startedAtMs: Number(req.get('x-video-start-ms')) || null,
          endedAtMs: Number(req.get('x-video-end-ms')) || null
        }
      });
      await updateCollectionStatusIfOpen(
        store,
        session.id,
        kind === 'consent-video' ? 'assent_pending' : 'game_in_progress'
      );
      res.status(201).json({ artifact });
    } catch (error) {
      next(error);
    }
  });

  router.put('/checkpoints/:sequence', async (req, res, next) => {
    try {
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      if (!requireOpenParticipantSession(session, res)) return;
      if (!await requireArtifactKinds(store, session.id, ['permission', 'consent-video', 'assent', 'liveness-video'], res)) return;
      const sequence = Number.parseInt(req.params.sequence, 10);
      if (!Number.isInteger(sequence) || sequence < 0 || sequence > 10000) {
        return res.status(400).json({ error: 'Invalid checkpoint sequence.' });
      }
      const existing = await store.findArtifact(session.id, 'behavior-checkpoint', sequence);
      if (existing) return res.json({ artifact: existing, duplicate: true });
      const stored = await storage.writeFile({
        folderId: session.storageFolders.behavior,
        name: `checkpoint-${String(sequence).padStart(4, '0')}.json`,
        mimeType: 'application/json',
        data: jsonBuffer({ ...req.body, sessionId: session.id, condition: session.condition })
      });
      const artifact = await store.recordArtifact({
        id: uuidv4(), sessionId: session.id, kind: 'behavior-checkpoint', sequence,
        fileName: stored.name, storageFileId: stored.id, mimeType: 'application/json',
        sizeBytes: stored.size, checksum: stored.checksum
      });
      await updateCollectionStatusIfOpen(store, session.id, 'game_in_progress');
      res.status(201).json({ artifact });
    } catch (error) {
      next(error);
    }
  });

  router.post('/complete', async (req, res, next) => {
    try {
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      if (['complete_pending_review', 'approved', 'excluded', 'needs_followup'].includes(session.status)) {
        return res.json({
          session: publicSession(session),
          manifest: await store.findArtifact(session.id, 'manifest', 0),
          duplicate: true
        });
      }
      if (!requireOpenParticipantSession(session, res)) return;
      if (!await requireArtifactKinds(
        store,
        session.id,
        ['permission', 'consent-video', 'assent', 'liveness-video', 'gameplay-video', 'behavior-checkpoint'],
        res
      )) return;
      const artifactsBefore = await store.listArtifacts(session.id);
      const finalSequence = 0;
      let finalArtifact = await store.findArtifact(session.id, 'behavior-final', finalSequence);
      if (!finalArtifact) {
        const stored = await storage.writeFile({
          folderId: session.storageFolders.behavior,
          name: 'behavior-final.json',
          mimeType: 'application/json',
          data: jsonBuffer({ ...req.body, sessionId: session.id, condition: session.condition })
        });
        finalArtifact = await store.recordArtifact({
          id: uuidv4(), sessionId: session.id, kind: 'behavior-final', sequence: finalSequence,
          fileName: stored.name, storageFileId: stored.id, mimeType: 'application/json',
          sizeBytes: stored.size, checksum: stored.checksum
        });
      }
      const allArtifacts = [...artifactsBefore, finalArtifact]
        .filter((value, index, array) => array.findIndex(item => item.id === value.id) === index);
      const manifest = {
        schemaVersion: '1.0',
        sessionId: session.id,
        condition: session.condition,
        completedAt: new Date().toISOString(),
        artifacts: allArtifacts.map(item => ({
          kind: item.kind,
          sequence: item.sequence,
          fileName: item.fileName,
          storageFileId: item.storageFileId,
          sizeBytes: item.sizeBytes,
          checksum: item.checksum
        }))
      };
      let manifestArtifact = await store.findArtifact(session.id, 'manifest', 0);
      if (!manifestArtifact) {
        const stored = await storage.writeFile({
          folderId: session.storageFolderId,
          name: 'manifest.json',
          mimeType: 'application/json',
          data: jsonBuffer(manifest)
        });
        manifestArtifact = await store.recordArtifact({
          id: uuidv4(), sessionId: session.id, kind: 'manifest', sequence: 0,
          fileName: stored.name, storageFileId: stored.id, mimeType: 'application/json',
          sizeBytes: stored.size, checksum: stored.checksum
        });
      }
      const completedAt = new Date().toISOString();
      const updated = await store.updateSession(session.id, { status: 'complete_pending_review', completedAt });
      res.json({ session: publicSession(updated), manifest: manifestArtifact });
    } catch (error) {
      next(error);
    }
  });

  router.post('/withdraw', async (req, res, next) => {
    try {
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      await storage.deleteSession(session.storageFolderId);
      const withdrawnAt = new Date().toISOString();
      await store.updateSession(session.id, { status: 'withdrawn', withdrawnAt, storageFolderId: null, storageFolders: {} });
      clearStudySessionCookie(res);
      res.json({ withdrawn: true, withdrawnAt });
    } catch (error) {
      next(error);
    }
  });

  router.post('/parent-decision', async (req, res, next) => {
    try {
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      if (!session.completedAt || ['withdrawn', 'withdrawal_video_deleted'].includes(session.status)) {
        return res.status(409).json({ error: 'The study must finish uploading before a parent decision can be saved.' });
      }
      const decision = req.body?.decision === 'withdraw' ? 'withdraw' :
        (req.body?.decision === 'keep' ? 'keep' : null);
      if (!decision) return res.status(400).json({ error: 'Choose whether to keep the data or request withdrawal.' });
      const existing = (await store.listArtifacts(session.id)).filter(item => item.kind === 'parent-decision');
      const sequence = existing.length ? Math.max(...existing.map(item => Number(item.sequence) || 0)) + 1 : 1;
      const submittedAt = new Date().toISOString();
      const decisionData = {
        schemaVersion: '1.0',
        sessionId: session.id,
        decision,
        notes: String(req.body?.notes || '').trim().slice(0, 2000),
        reviewedGameplayVideo: req.body?.reviewedGameplayVideo === true,
        submittedAt
      };
      const stored = await storage.writeFile({
        folderId: session.storageFolders.questionnaire,
        name: `parent-decision-${String(sequence).padStart(4, '0')}.json`,
        mimeType: 'application/json',
        data: jsonBuffer(decisionData)
      });
      const artifact = await store.recordArtifact({
        id: uuidv4(), sessionId: session.id, kind: 'parent-decision', sequence,
        fileName: stored.name, storageFileId: stored.id, mimeType: 'application/json',
        sizeBytes: stored.size, checksum: stored.checksum
      });
      const status = decision === 'withdraw' ? 'withdrawal_requested' : 'complete_pending_review';
      const updated = await store.updateSession(session.id, {
        status,
        metadata: { latestParentDecision: decision, parentDecisionAt: submittedAt }
      });
      res.json({ session: publicSession(updated), artifact, decision });
    } catch (error) {
      next(error);
    }
  });

  router.post('/withdrawal-link', async (req, res, next) => {
    try {
      if (!directDeletionLinksEnabled) {
        return res.status(404).json({ error: 'Direct deletion links are disabled; submit a parent decision instead.' });
      }
      const session = await requireStudySession(req, res, store);
      if (!session) return;
      if (!['complete_pending_review', 'approved', 'excluded', 'needs_followup'].includes(session.status)) {
        return res.status(409).json({ error: 'The study must finish uploading before a deletion link can be issued.' });
      }
      const cooldownSeconds = Math.max(10, Number(process.env.STUDY_WITHDRAWAL_LINK_COOLDOWN_SECONDS || 60));
      const lastIssuedAt = new Date(session.metadata?.withdrawalLinkIssuedAt || 0).getTime();
      if (Date.now() - lastIssuedAt < cooldownSeconds * 1000) {
        return res.status(429).json({ error: 'Please wait before requesting another deletion link.' });
      }
      const parentEmail = String(req.body?.parentEmail || '').trim().toLowerCase();
      if (!validEmail(parentEmail)) return res.status(400).json({ error: 'Enter a valid parent email address.' });

      const token = crypto.randomBytes(32).toString('base64url');
      const tokenHash = hashToken(token);
      const lifetimeDays = Math.min(365, Math.max(1, Number(process.env.STUDY_WITHDRAWAL_LINK_DAYS || 30)));
      const expiresAt = new Date(Date.now() + lifetimeDays * 86400000).toISOString();
      const publicBaseUrl = String(process.env.PUBLIC_STUDY_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
      const deletionUrl = `${publicBaseUrl}/api/study/withdraw/${token}`;

      await store.updateSession(session.id, {
        metadata: {
          withdrawalTokenHash: tokenHash,
          withdrawalTokenExpiresAt: expiresAt,
          withdrawalLinkIssuedAt: new Date().toISOString()
        }
      });
      const delivery = await sendWithdrawalDeletionEmail({ to: parentEmail, deletionUrl, expiresAt });
      res.json({
        sent: delivery.sent,
        expiresAt,
        ...(delivery.sent ? {} : { testDeletionUrl: deletionUrl })
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/withdraw/:token', async (req, res, next) => {
    try {
      if (!directDeletionLinksEnabled) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(410).type('html').send(deletionPage({ token: '', expired: true }));
      }
      const token = String(req.params.token || '');
      const session = token.length >= 32
        ? await store.findSessionByWithdrawalTokenHash(hashToken(token))
        : null;
      const valid = session && session.status !== 'withdrawn' && session.storageFolderId &&
        new Date(session.metadata?.withdrawalTokenExpiresAt || 0).getTime() > Date.now();
      res.setHeader('Cache-Control', 'no-store');
      res.status(valid ? 200 : 410).type('html').send(deletionPage({ token, expired: !valid }));
    } catch (error) {
      next(error);
    }
  });

  router.post('/withdraw/:token', async (req, res, next) => {
    try {
      if (!directDeletionLinksEnabled) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(410).type('html').send(deletionPage({ token: '', expired: true }));
      }
      const token = String(req.params.token || '');
      const session = token.length >= 32
        ? await store.findSessionByWithdrawalTokenHash(hashToken(token))
        : null;
      const valid = session && session.status !== 'withdrawn' && session.storageFolderId &&
        new Date(session.metadata?.withdrawalTokenExpiresAt || 0).getTime() > Date.now();
      if (!valid) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(410).type('html').send(deletionPage({ token, expired: true }));
      }
      await storage.deleteSession(session.storageFolderId);
      const withdrawnAt = new Date().toISOString();
      await store.updateSession(session.id, {
        status: 'withdrawn',
        withdrawnAt,
        storageFolderId: null,
        storageFolders: {},
        metadata: { withdrawalTokenHash: null, withdrawalTokenExpiresAt: null, deletionConfirmedAt: withdrawnAt }
      });
      clearStudySessionCookie(res);
      res.setHeader('Cache-Control', 'no-store');
      res.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Study data deleted</title></head><body style="font-family:Arial,sans-serif;background:#f4f7fb;padding:24px;"><main style="max-width:650px;margin:50px auto;background:#fff;padding:32px;border-radius:12px;"><h1>Study data deleted</h1><p>The session’s stored videos and behavioral data have been deleted. You may close this page.</p></main></body></html>`);
    } catch (error) {
      next(error);
    }
  });

  router.get('/admin/sessions', async (req, res, next) => {
    try {
      if (!requireAdmin(req, res)) return;
      const sessions = await store.listSessions();
      const withCounts = await Promise.all(sessions.map(async session => ({
        ...publicSession(session),
        artifactCount: (await store.listArtifacts(session.id)).length
      })));
      res.json({ sessions: withCounts });
    } catch (error) {
      next(error);
    }
  });

  router.get('/admin/sessions/:id', async (req, res, next) => {
    try {
      if (!requireAdmin(req, res)) return;
      const session = await store.getSession(req.params.id);
      if (!session) return res.status(404).json({ error: 'Session not found.' });
      res.json({ session: publicSession(session), artifacts: await store.listArtifacts(session.id) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/sessions/:id/review', async (req, res, next) => {
    try {
      if (!requireAdmin(req, res)) return;
      const session = await store.getSession(req.params.id);
      if (!session) return res.status(404).json({ error: 'Session not found.' });
      if (session.status === 'withdrawal_requested') {
        return res.status(409).json({ error: 'Resolve the parent withdrawal request by deleting the videos before recording another review decision.' });
      }
      const decision = ['approved', 'excluded', 'needs_followup'].includes(req.body?.decision)
        ? req.body.decision
        : 'needs_followup';
      const review = await store.recordReview(session.id, {
        decision,
        reviewer: String(req.body?.reviewer || '').slice(0, 120),
        reviewData: req.body?.reviewData || {}
      });
      await store.updateSession(session.id, { status: decision });
      res.json({ review });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/sessions/:id/delete-videos', async (req, res, next) => {
    try {
      if (!requireAdmin(req, res)) return;
      const session = await store.getSession(req.params.id);
      if (!session) return res.status(404).json({ error: 'Session not found.' });
      if (session.status !== 'withdrawal_requested') {
        return res.status(409).json({ error: 'Video deletion requires a recorded parent withdrawal request.' });
      }
      const videoKinds = new Set(['consent-video', 'liveness-video', 'gameplay-video']);
      const artifacts = (await store.listArtifacts(session.id)).filter(
        item => videoKinds.has(item.kind) && !item.metadata?.deletedAt
      );
      const deletedAt = new Date().toISOString();
      for (const artifact of artifacts) {
        await storage.deleteFile(artifact.storageFileId);
        await store.markArtifactDeleted(artifact, deletedAt);
      }
      const auditData = {
        schemaVersion: '1.0',
        sessionId: session.id,
        deletedAt,
        deletedVideoCount: artifacts.length,
        researcher: String(req.body?.researcher || '').slice(0, 120),
        videos: artifacts.map(item => ({ kind: item.kind, sequence: item.sequence, fileName: item.fileName }))
      };
      const auditStored = await storage.writeFile({
        folderId: session.storageFolders.behavior,
        name: 'video-deletion-audit.json',
        mimeType: 'application/json',
        data: jsonBuffer(auditData)
      });
      await store.recordArtifact({
        id: uuidv4(), sessionId: session.id, kind: 'video-deletion-audit', sequence: 0,
        fileName: auditStored.name, storageFileId: auditStored.id, mimeType: 'application/json',
        sizeBytes: auditStored.size, checksum: auditStored.checksum
      });
      const updated = await store.updateSession(session.id, {
        status: 'withdrawal_video_deleted',
        metadata: {
          videoDeletionAt: deletedAt,
          videoDeletionCount: artifacts.length,
          videoDeletedBy: String(req.body?.researcher || '').slice(0, 120)
        }
      });
      res.json({ session: publicSession(updated), deletedVideoCount: artifacts.length, deletedAt });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
