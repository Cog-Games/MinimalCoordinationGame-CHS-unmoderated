import { CONFIG, GameConfigUtils } from '../config/gameConfig.js';
import { CameraRecorder } from '../media/CameraRecorder.js';
import { DriveUploadQueue } from '../media/DriveUploadQueue.js';
import { StudySessionClient } from './StudySessionClient.js';

const escapeHtml = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export class SelfHostedStudyManager {
  constructor(container) {
    this.container = container;
    this.enabled = true;
    this.client = new StudySessionClient({ baseUrl: CONFIG.study.apiBaseUrl });
    this.camera = new CameraRecorder({
      segmentDurationMs: CONFIG.study.recording.segmentDurationMs,
      videoBitsPerSecond: CONFIG.study.recording.videoBitsPerSecond
    });
    this.uploadQueue = null;
    this.session = null;
    this.artifacts = [];
    this.videoSequence = 1;
    this.checkpointSequence = 1;
    this.pendingSaves = new Set();
    this.sessionStartedAtMs = performance.now();
    this.prepared = false;
    this.completed = false;
    this.withdrawing = false;
    this.previewSegments = [];
    this.previewObjectUrls = [];
    this.indicator = null;
    this.boundBeforeUnload = event => {
      if (!this.completed && (this.camera.segmenting || this.uploadQueue?.pendingCount)) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    this.boundCameraEnded = event => {
      if (!this.prepared || this.completed || this.withdrawing) return;
      const label = this.indicator?.querySelector('[data-recording-status]');
      if (label) label.textContent = `Camera ${event.detail?.kind || ''} stopped — please ask a guardian for help`;
      if (this.indicator) this.indicator.style.background = '#9f1239';
    };
  }

  async prepare() {
    const params = new URLSearchParams(window.location.search);
    const participantCode = params.get('accessCode') || params.get('token') || '';
    const restored = await this.client.resumeOrStart({ participantCode });
    this.session = restored.session;
    this.artifacts = restored.artifacts || [];
    if (['complete_pending_review', 'approved', 'excluded', 'needs_followup', 'withdrawal_requested'].includes(this.session.status)) {
      this.renderMessage('Study already completed', 'This study session has already been saved. Thank you!');
      this.showParentRecordingReview();
      return false;
    }
    if (this.session.status === 'withdrawal_video_deleted') {
      this.renderMessage('Withdrawal completed', 'The researchers recorded the parent request and deleted the stored video files.');
      return false;
    }
    if (this.session.status === 'withdrawn') {
      this.renderMessage('Session withdrawn', 'The stored files for this session have been deleted.');
      return false;
    }

    GameConfigUtils.setPlayerType(2, this.session.condition === 'individual' ? 'rl_individual' : 'rl_joint');
    this.uploadQueue = new DriveUploadQueue({ client: this.client, sessionId: this.session.id });
    await this.uploadQueue.restore();
    this.videoSequence = this.nextSequence('gameplay-video');
    this.checkpointSequence = this.nextSequence('behavior-checkpoint');

    if (!this.hasArtifact('permission')) await this.runPermissionStage();
    await this.runCameraSetupStage();
    if (!this.hasArtifact('consent-video')) await this.runGuardianConsentRecording();
    if (!this.hasArtifact('assent')) await this.runChildAssentStage();
    if (!this.hasArtifact('liveness-video')) await this.runLivenessStage();

    this.showRecordingIndicator();
    this.camera.startSegmented(segment => {
      const sequence = this.videoSequence++;
      this.previewSegments.push({ sequence, blob: segment.blob });
      this.updateIndicator();
      return this.uploadQueue.enqueue(segment.blob, {
        label: 'gameplay',
        sequence,
        startedAtMs: segment.startedAtMs - this.sessionStartedAtMs,
        endedAtMs: segment.endedAtMs - this.sessionStartedAtMs
      }).finally(() => this.updateIndicator());
    });
    window.addEventListener('beforeunload', this.boundBeforeUnload);
    window.addEventListener('study-camera-ended', this.boundCameraEnded);
    this.prepared = true;
    return true;
  }

  hasArtifact(kind) {
    return this.artifacts.some(item => item.kind === kind);
  }

  nextSequence(kind) {
    const sequences = this.artifacts.filter(item => item.kind === kind).map(item => Number(item.sequence) || 0);
    return sequences.length ? Math.max(...sequences) + 1 : 1;
  }

  renderShell(content) {
    this.container.innerHTML = `
      <div style="box-sizing:border-box;min-height:100vh;background:#f4f7fb;padding:28px;display:flex;align-items:center;justify-content:center;">
        <main style="box-sizing:border-box;width:min(760px,100%);background:#fff;border-radius:14px;padding:32px;box-shadow:0 12px 35px rgba(30,50,80,.14);font-family:Arial,sans-serif;color:#222;">
          ${content}
        </main>
      </div>`;
  }

  renderMessage(title, message) {
    this.renderShell(`<h1 style="margin-top:0;">${escapeHtml(title)}</h1><p style="font-size:18px;line-height:1.5;">${escapeHtml(message)}</p>`);
  }

  async runPermissionStage() {
    this.renderShell(`
      <h1 style="margin-top:0;">Parent or guardian permission</h1>
      <div style="padding:16px;background:#fff8e5;border:1px solid #e8c66b;border-radius:8px;margin-bottom:18px;">
        <strong>Testing notice:</strong> Replace this page with the exact IRB-approved permission language before collecting research data.
      </div>
      <p style="line-height:1.55;">This test version records the participating child while they play a computer game. A short guardian statement and the gameplay recording will be stored in the configured Google Drive folder and viewed later by authorized researchers. The recording is not monitored live.</p>
      <form id="studyPermissionForm" style="display:grid;gap:16px;">
        <label>Parent email
          <input id="studyParentEmail" type="email" required autocomplete="email" style="box-sizing:border-box;width:100%;padding:11px;margin-top:5px;">
        </label>
        <label>Child date of birth
          <input id="studyChildDob" type="date" required style="box-sizing:border-box;width:100%;padding:11px;margin-top:5px;">
        </label>
        <label style="display:flex;gap:10px;align-items:flex-start;"><input id="studyPermissionAgree" type="checkbox" required> <span>I give permission for my child to take part in this test study.</span></label>
        <label style="display:flex;gap:10px;align-items:flex-start;"><input id="studyRecordingAgree" type="checkbox" required> <span>I understand that the camera and microphone will record a consent statement and gameplay.</span></label>
        <button type="submit" style="padding:13px 22px;border:0;border-radius:8px;background:#1769aa;color:#fff;font-size:18px;cursor:pointer;">Continue to camera setup</button>
        <div id="studyPermissionError" role="alert" style="color:#b00020;min-height:20px;"></div>
      </form>`);

    await new Promise((resolve, reject) => {
      document.getElementById('studyPermissionForm').addEventListener('submit', async event => {
        event.preventDefault();
        const button = event.currentTarget.querySelector('button');
        button.disabled = true;
        try {
          this.parentEmail = document.getElementById('studyParentEmail').value.trim();
          await this.client.savePermission({
            permissionVersion: CONFIG.study.permissionVersion,
            agreed: document.getElementById('studyPermissionAgree').checked,
            recordingAcknowledged: document.getElementById('studyRecordingAgree').checked,
            parentEmail: this.parentEmail,
            participantDob: document.getElementById('studyChildDob').value
          });
          resolve();
        } catch (error) {
          button.disabled = false;
          document.getElementById('studyPermissionError').textContent = error.message;
        }
      });
    });
  }

  async runCameraSetupStage() {
    this.renderShell(`
      <h1 style="margin-top:0;">Camera setup</h1>
      <p>Place the computer so the participating child’s face and upper body are visible. Please keep other children and private household information out of view.</p>
      <video id="studyCameraPreview" autoplay muted playsinline style="display:block;width:min(640px,100%);aspect-ratio:4/3;object-fit:cover;background:#111;border-radius:10px;margin:18px auto;"></video>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button id="enableStudyCamera" type="button" style="padding:13px 22px;border:0;border-radius:8px;background:#1769aa;color:#fff;font-size:18px;cursor:pointer;">Enable camera and microphone</button>
        <button id="continueAfterCamera" type="button" disabled hidden style="padding:13px 22px;border:0;border-radius:8px;background:#218739;color:#fff;font-size:18px;cursor:pointer;">Continue</button>
      </div>
      <div id="cameraSetupStatus" role="status" style="color:#16733b;margin-top:14px;text-align:center;min-height:20px;"></div>
      <div id="cameraSetupError" role="alert" style="color:#b00020;margin-top:14px;text-align:center;"></div>`);
    await new Promise(resolve => {
      const enableButton = document.getElementById('enableStudyCamera');
      const continueButton = document.getElementById('continueAfterCamera');
      const status = document.getElementById('cameraSetupStatus');
      const error = document.getElementById('cameraSetupError');

      continueButton.addEventListener('click', () => resolve(), { once: true });
      enableButton.addEventListener('click', async event => {
        const button = event.currentTarget;
        button.disabled = true;
        error.textContent = '';
        try {
          const stream = await this.camera.initialize({ audio: CONFIG.study.recording.audio });
          document.getElementById('studyCameraPreview').srcObject = stream;
          button.textContent = 'Camera and microphone enabled';
          status.textContent = 'Camera ready. Click Continue to record guardian permission.';
          continueButton.hidden = false;
          continueButton.disabled = false;
          continueButton.focus();
        } catch (error) {
          button.disabled = false;
          document.getElementById('cameraSetupError').textContent = error.message;
        }
      });
    });
  }

  attachPreview() {
    const preview = document.getElementById('studyCameraPreview');
    if (preview) preview.srcObject = this.camera.stream;
  }

  async runGuardianConsentRecording() {
    this.renderShell(`
      <h1 style="margin-top:0;">Record guardian permission</h1>
      <p>With the child visible, please read the approved statement aloud. For this test:</p>
      <blockquote style="background:#f1f5f9;padding:16px;border-left:4px solid #1769aa;line-height:1.5;">I am this child’s parent or legal guardian. I understand that this test records my child while playing the game, and I give permission for us to participate.</blockquote>
      <video id="studyCameraPreview" autoplay muted playsinline style="display:block;width:min(640px,100%);aspect-ratio:4/3;object-fit:cover;background:#111;border-radius:10px;margin:18px auto;"></video>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="startConsentClip" style="padding:12px 20px;border:0;border-radius:8px;background:#b42318;color:#fff;font-size:17px;cursor:pointer;">Start recording</button>
        <button id="stopConsentClip" disabled style="padding:12px 20px;border:0;border-radius:8px;background:#1769aa;color:#fff;font-size:17px;">Stop and upload</button>
      </div>
      <div id="consentClipStatus" style="text-align:center;margin-top:14px;min-height:22px;"></div>`);
    this.attachPreview();
    await new Promise((resolve, reject) => {
      const start = document.getElementById('startConsentClip');
      const stop = document.getElementById('stopConsentClip');
      const status = document.getElementById('consentClipStatus');
      start.addEventListener('click', () => {
        this.camera.beginClip();
        start.disabled = true;
        status.textContent = 'Recording… read the statement aloud.';
        setTimeout(() => { stop.disabled = false; stop.style.cursor = 'pointer'; }, 3000);
      });
      stop.addEventListener('click', async () => {
        stop.disabled = true;
        status.textContent = 'Uploading consent recording…';
        try {
          const clip = await this.camera.endClip();
          await this.uploadQueue.enqueue(clip.blob, {
            label: 'guardian-consent', sequence: 0,
            startedAtMs: clip.startedAtMs - this.sessionStartedAtMs,
            endedAtMs: clip.endedAtMs - this.sessionStartedAtMs
          });
          status.textContent = 'Consent recording saved.';
          resolve();
        } catch (error) {
          status.textContent = `Upload failed: ${error.message}`;
          reject(error);
        }
      });
    });
  }

  async runChildAssentStage() {
    this.renderShell(`
      <h1 style="margin-top:0;">A question for the child</h1>
      <p style="font-size:20px;line-height:1.55;">You will play a game while the camera records you. The researchers will watch the recording later. You can stop whenever you want.</p>
      <p style="font-size:22px;font-weight:bold;">Do you want to play the game?</p>
      <div style="display:flex;gap:16px;justify-content:center;">
        <button id="childSaysYes" style="padding:16px 32px;border:0;border-radius:9px;background:#218739;color:#fff;font-size:22px;cursor:pointer;">Yes</button>
        <button id="childSaysNo" style="padding:16px 32px;border:0;border-radius:9px;background:#b42318;color:#fff;font-size:22px;cursor:pointer;">No</button>
      </div>`);
    const response = await new Promise(resolve => {
      document.getElementById('childSaysYes').onclick = () => resolve('yes');
      document.getElementById('childSaysNo').onclick = () => resolve('no');
    });
    try {
      await this.client.saveAssent({ assentVersion: CONFIG.study.assentVersion, childResponse: response });
    } catch (error) {
      if (response === 'no') {
        this.camera.stopStream();
        this.renderMessage('Thank you', 'The study has stopped because the child did not want to participate.');
      }
      throw error;
    }
  }

  async runLivenessStage() {
    const prompts = [
      { id: 'wave_twice', text: 'Please wave two times at the camera.' },
      { id: 'show_three', text: 'Please hold up three fingers.' },
      { id: 'touch_head', text: 'Please touch the top of your head.' }
    ];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    this.renderShell(`
      <h1 style="margin-top:0;">Quick camera check</h1>
      <p style="font-size:24px;font-weight:bold;text-align:center;">${escapeHtml(prompt.text)}</p>
      <video id="studyCameraPreview" autoplay muted playsinline style="display:block;width:min(640px,100%);aspect-ratio:4/3;object-fit:cover;background:#111;border-radius:10px;margin:18px auto;"></video>
      <button id="recordLiveness" style="display:block;margin:auto;padding:13px 22px;border:0;border-radius:8px;background:#1769aa;color:#fff;font-size:18px;cursor:pointer;">Record the 5-second check</button>
      <div id="livenessStatus" style="text-align:center;margin-top:12px;min-height:22px;"></div>`);
    this.attachPreview();
    await new Promise((resolve, reject) => {
      document.getElementById('recordLiveness').onclick = async event => {
        event.currentTarget.disabled = true;
        const status = document.getElementById('livenessStatus');
        status.textContent = 'Recording…';
        try {
          const clip = await this.camera.recordFor(5000);
          status.textContent = 'Uploading check…';
          await this.uploadQueue.enqueue(clip.blob, {
            label: 'liveness', sequence: 0,
            startedAtMs: clip.startedAtMs - this.sessionStartedAtMs,
            endedAtMs: clip.endedAtMs - this.sessionStartedAtMs
          });
          resolve();
        } catch (error) {
          status.textContent = error.message;
          reject(error);
        }
      };
    });
  }

  showRecordingIndicator() {
    this.indicator = document.createElement('div');
    this.indicator.id = 'studyRecordingIndicator';
    this.indicator.setAttribute('role', 'status');
    this.indicator.style.cssText = 'position:fixed;z-index:99999;right:14px;top:14px;padding:8px 10px 8px 13px;border-radius:999px;background:#7f1d1d;color:white;font:600 14px Arial,sans-serif;box-shadow:0 3px 12px rgba(0,0,0,.25);display:flex;align-items:center;gap:10px;';
    this.indicator.innerHTML = `
      <span data-recording-status></span>
      <button type="button" data-stop-study style="border:1px solid rgba(255,255,255,.7);border-radius:999px;background:#fff;color:#7f1d1d;padding:5px 9px;font:700 12px Arial,sans-serif;cursor:pointer;">Stop study</button>`;
    this.indicator.querySelector('[data-stop-study]').addEventListener('click', async event => {
      if (!window.confirm('Stop the study and delete this session’s stored files?')) return;
      event.currentTarget.disabled = true;
      const label = this.indicator?.querySelector('[data-recording-status]');
      if (label) label.textContent = 'Stopping and deleting stored files…';
      try {
        await this.withdraw();
      } catch (error) {
        event.currentTarget.disabled = false;
        if (label) label.textContent = `Could not stop: ${error.message}`;
      }
    });
    document.body.appendChild(this.indicator);
    this.updateIndicator();
  }

  updateIndicator() {
    if (!this.indicator) return;
    const pending = this.uploadQueue?.pendingCount || 0;
    const label = this.indicator.querySelector('[data-recording-status]');
    if (label) label.textContent = `● Recording${pending ? ` · uploading ${pending}` : ''}`;
  }

  markTrialStart(experimentType, experimentIndex, trialIndex) {
    this.currentTrialMarker = {
      experimentType,
      experimentIndex,
      trialIndex,
      sessionElapsedStartMs: performance.now() - this.sessionStartedAtMs
    };
  }

  saveTrialCheckpoint(trialData) {
    if (!this.prepared || !trialData) return Promise.resolve();
    const sequence = this.checkpointSequence++;
    const payload = {
      schemaVersion: '1.0',
      studyVersion: CONFIG.game.version,
      sessionElapsedEndMs: performance.now() - this.sessionStartedAtMs,
      marker: this.currentTrialMarker || null,
      trialData
    };
    const promise = this.client.saveCheckpoint(sequence, payload);
    this.pendingSaves.add(promise);
    promise.finally(() => this.pendingSaves.delete(promise));
    return promise;
  }

  async complete(finalData) {
    if (this.completed) return;
    this.setSaveProgress(5, 'Stopping camera recording…');
    await this.camera.stopSegmented();
    this.setSaveProgress(65, 'Video segments uploaded. Checking the upload queue…');
    await this.uploadQueue.flush();
    this.setSaveProgress(75, 'Saving trial checkpoints…');
    const saveResults = await Promise.allSettled([...this.pendingSaves]);
    const failed = saveResults.find(result => result.status === 'rejected');
    if (failed) throw failed.reason;
    this.setSaveProgress(88, 'Saving final behavioral data…');
    await this.client.complete({
      schemaVersion: '1.0',
      studyVersion: CONFIG.game.version,
      completedAt: new Date().toISOString(),
      condition: this.session.condition,
      ...finalData
    });
    this.setSaveProgress(100, 'All videos and behavioral data are saved.');
    await new Promise(resolve => setTimeout(resolve, 450));
    this.completed = true;
    this.camera.stopStream();
    this.indicator?.remove();
    window.removeEventListener('beforeunload', this.boundBeforeUnload);
    window.removeEventListener('study-camera-ended', this.boundCameraEnded);
  }

  setSaveProgress(percent, label, isError = false) {
    const bar = document.getElementById('studySaveProgressBar');
    const progress = document.getElementById('studySaveProgress');
    const progressLabel = document.getElementById('studySaveProgressLabel');
    if (bar && Number.isFinite(percent)) bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    if (progress && Number.isFinite(percent)) progress.setAttribute('aria-valuenow', String(Math.round(percent)));
    if (progressLabel) {
      progressLabel.textContent = label;
      progressLabel.style.color = isError ? '#b00020' : '#475569';
    }
    if (bar) bar.style.background = isError ? '#b00020' : '#1769aa';
  }

  showParentRecordingReview() {
    if (document.getElementById('studyParentRecordingReview')) return;
    const host = document.getElementById('saving-status')?.parentElement?.parentElement ||
      this.container.querySelector('main');
    if (!host) return;
    const section = document.createElement('section');
    section.id = 'studyParentRecordingReview';
    section.style.cssText = 'margin-top:24px;padding:20px;border:1px solid #cbd5e1;border-radius:10px;text-align:left;background:#f8fafc;';
    section.innerHTML = `
      <h3 style="margin:0 0 10px;">Review the gameplay recording</h3>
      <p style="line-height:1.45;margin:0 0 14px;">A parent may quickly review the gameplay recording before deciding whether the researchers may keep it. Use the video timeline to skip forward or backward, and choose a faster playback speed if helpful.</p>
      <div id="parentVideoPreview"></div>
      <form id="parentDataDecisionForm" style="margin-top:20px;display:grid;gap:12px;">
        <fieldset style="border:0;padding:0;margin:0;display:grid;gap:10px;">
          <legend style="font-weight:bold;margin-bottom:8px;">What should the research team do?</legend>
          <label><input type="radio" name="parentDataDecision" value="keep" required> Keep the uploaded video and study data</label>
          <label><input type="radio" name="parentDataDecision" value="withdraw" required> Record a withdrawal request; the research team will delete the videos</label>
        </fieldset>
        <label>Optional comments
          <textarea id="parentDecisionNotes" maxlength="2000" style="box-sizing:border-box;width:100%;min-height:75px;padding:9px;margin-top:5px;border:1px solid #aebbc9;border-radius:7px;"></textarea>
        </label>
        <label><input id="parentReviewedVideo" type="checkbox"> I reviewed the gameplay recording before making this decision.</label>
        <button type="submit" style="padding:11px 17px;border:0;border-radius:7px;background:#1769aa;color:#fff;font-size:16px;cursor:pointer;">Submit parent decision</button>
        <div id="parentDecisionStatus" role="status" style="min-height:22px;"></div>
      </form>`;
    host.appendChild(section);

    const preview = section.querySelector('#parentVideoPreview');
    const segments = [...this.previewSegments].sort((a, b) => a.sequence - b.sequence);
    if (segments.length) {
      this.previewObjectUrls.forEach(url => URL.revokeObjectURL(url));
      this.previewObjectUrls = segments.map(segment => URL.createObjectURL(segment.blob));
      preview.innerHTML = `
        <video id="parentGameplayPreview" controls playsinline preload="metadata" style="display:block;width:100%;max-height:440px;background:#111;border-radius:9px;"></video>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;">
          <button id="previousPreviewSegment" type="button" style="padding:8px 11px;">Previous part</button>
          <label>Recording part <select id="previewSegmentSelect" style="padding:8px;"></select></label>
          <button id="nextPreviewSegment" type="button" style="padding:8px 11px;">Next part</button>
          <label>Speed <select id="previewPlaybackRate" style="padding:8px;"><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
        </div>`;
      const video = preview.querySelector('#parentGameplayPreview');
      const select = preview.querySelector('#previewSegmentSelect');
      segments.forEach((segment, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${index + 1} of ${segments.length}`;
        select.appendChild(option);
      });
      let currentIndex = 0;
      const loadSegment = index => {
        currentIndex = Math.max(0, Math.min(segments.length - 1, index));
        video.src = this.previewObjectUrls[currentIndex];
        select.value = String(currentIndex);
        preview.querySelector('#previousPreviewSegment').disabled = currentIndex === 0;
        preview.querySelector('#nextPreviewSegment').disabled = currentIndex === segments.length - 1;
      };
      select.addEventListener('change', () => loadSegment(Number(select.value)));
      preview.querySelector('#previousPreviewSegment').addEventListener('click', () => loadSegment(currentIndex - 1));
      preview.querySelector('#nextPreviewSegment').addEventListener('click', () => loadSegment(currentIndex + 1));
      preview.querySelector('#previewPlaybackRate').addEventListener('change', event => {
        video.playbackRate = Number(event.currentTarget.value) || 1;
      });
      video.addEventListener('ended', () => {
        if (currentIndex < segments.length - 1) {
          loadSegment(currentIndex + 1);
          video.play().catch(() => {});
        }
      });
      loadSegment(0);
    } else {
      preview.innerHTML = '<p style="padding:12px;background:#fff8e5;border-radius:7px;">The in-browser preview is available immediately after completing the study. It is no longer available after this page is refreshed, but a parent decision can still be submitted below.</p>';
    }

    section.querySelector('#parentDataDecisionForm').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const button = form.querySelector('button[type="submit"]');
      const status = section.querySelector('#parentDecisionStatus');
      const decision = form.elements.parentDataDecision.value;
      button.disabled = true;
      status.textContent = 'Saving the parent decision…';
      try {
        await this.client.saveParentDecision({
          decision,
          notes: section.querySelector('#parentDecisionNotes').value,
          reviewedGameplayVideo: section.querySelector('#parentReviewedVideo').checked
        });
        status.textContent = decision === 'withdraw'
          ? 'Withdrawal request recorded. The research team will review it and delete the stored videos.'
          : 'Decision recorded. The research team may retain the uploaded video and study data.';
        form.querySelectorAll('input, textarea, button').forEach(control => { control.disabled = true; });
      } catch (error) {
        status.textContent = error.message;
        button.disabled = false;
      }
    });
  }

  async withdraw() {
    if (this.withdrawing) return;
    this.withdrawing = true;
    try {
      await this.camera.stopSegmented();
      await this.uploadQueue?.flush().catch(error => {
        console.warn('Pending uploads could not finish before withdrawal; server-side deletion will still be requested.', error);
      });
      await this.client.withdraw();
      this.completed = true;
      this.camera.stopStream();
      this.indicator?.remove();
      window.removeEventListener('beforeunload', this.boundBeforeUnload);
      window.removeEventListener('study-camera-ended', this.boundCameraEnded);
      this.renderMessage('Study stopped', 'This session’s stored files have been deleted. You may close this page.');
    } finally {
      this.withdrawing = false;
    }
  }
}
