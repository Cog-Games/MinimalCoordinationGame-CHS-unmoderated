export class CameraRecorder {
  constructor({ segmentDurationMs = 30000, videoBitsPerSecond = 900000 } = {}) {
    this.segmentDurationMs = segmentDurationMs;
    this.videoBitsPerSecond = videoBitsPerSecond;
    this.stream = null;
    this.mimeType = '';
    this.currentClip = null;
    this.segmenting = false;
    this.segmentLoopPromise = null;
    this.segmentWaitResolve = null;
    this.pendingSegmentCallbacks = new Set();
    this.lastSegmentCallbackError = null;
  }

  static selectMimeType() {
    const candidates = [
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4'
    ];
    return candidates.find(type => window.MediaRecorder?.isTypeSupported?.(type)) || '';
  }

  async initialize({ audio = true } = {}) {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      throw new Error('This browser does not support webcam recording. Please use a current desktop browser.');
    }
    this.mimeType = CameraRecorder.selectMimeType();
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 15, max: 24 },
        facingMode: 'user'
      },
      audio
    });
    this.stream.getTracks().forEach(track => {
      track.addEventListener('ended', () => {
        window.dispatchEvent(new CustomEvent('study-camera-ended', { detail: { kind: track.kind } }));
      });
    });
    return this.stream;
  }

  beginClip() {
    if (!this.stream) throw new Error('Camera has not been initialized.');
    if (this.currentClip) throw new Error('A recording is already active.');
    const chunks = [];
    const options = {
      videoBitsPerSecond: this.videoBitsPerSecond,
      ...(this.mimeType ? { mimeType: this.mimeType } : {})
    };
    const recorder = new MediaRecorder(this.stream, options);
    const startedAtMs = performance.now();
    const startedAtUtc = new Date().toISOString();
    let resolveStop;
    let rejectStop;
    const stopped = new Promise((resolve, reject) => {
      resolveStop = resolve;
      rejectStop = reject;
    });
    recorder.addEventListener('dataavailable', event => {
      if (event.data?.size) chunks.push(event.data);
    });
    recorder.addEventListener('error', event => rejectStop(event.error || new Error('Camera recording failed.')));
    recorder.addEventListener('stop', () => {
      const endedAtMs = performance.now();
      const blob = new Blob(chunks, { type: recorder.mimeType || this.mimeType || 'video/webm' });
      resolveStop({ blob, startedAtMs, endedAtMs, startedAtUtc, mimeType: blob.type });
    }, { once: true });
    recorder.start(1000);
    this.currentClip = { recorder, stopped };
  }

  async endClip() {
    const clip = this.currentClip;
    if (!clip) return null;
    this.currentClip = null;
    if (clip.recorder.state !== 'inactive') {
      try { clip.recorder.requestData(); } catch (_) { /* browser may already be stopping */ }
      clip.recorder.stop();
    }
    return clip.stopped;
  }

  async recordFor(durationMs) {
    this.beginClip();
    await new Promise(resolve => setTimeout(resolve, durationMs));
    return this.endClip();
  }

  startSegmented(onSegment) {
    if (this.segmenting) return this.segmentLoopPromise;
    this.segmenting = true;
    this.segmentLoopPromise = (async () => {
      while (this.segmenting) {
        this.beginClip();
        await new Promise(resolve => {
          const timeout = setTimeout(resolve, this.segmentDurationMs);
          this.segmentWaitResolve = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
        this.segmentWaitResolve = null;
        const segment = await this.endClip();
        if (segment?.blob?.size) {
          const callbackPromise = Promise.resolve().then(() => onSegment(segment));
          this.pendingSegmentCallbacks.add(callbackPromise);
          callbackPromise.catch(error => {
            this.lastSegmentCallbackError = error;
            window.dispatchEvent(new CustomEvent('study-upload-error', { detail: { error } }));
          }).finally(() => this.pendingSegmentCallbacks.delete(callbackPromise));
        }
      }
    })();
    return this.segmentLoopPromise;
  }

  async stopSegmented() {
    if (this.segmenting) {
      this.segmenting = false;
      this.segmentWaitResolve?.();
      await this.segmentLoopPromise;
      this.segmentLoopPromise = null;
    }
    await Promise.allSettled([...this.pendingSegmentCallbacks]);
    if (this.lastSegmentCallbackError) {
      const error = this.lastSegmentCallbackError;
      this.lastSegmentCallbackError = null;
      throw error;
    }
  }

  stopStream() {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }
}
