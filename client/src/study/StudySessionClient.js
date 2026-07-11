export class StudySessionClient {
  constructor({ baseUrl = '/api/study' } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.session = null;
  }

  async request(path, options = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body && !(options.body instanceof Blob) ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      }
    });
    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const message = typeof body === 'object' ? body.error : body;
      const error = new Error(message || `Request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    if (body?.session) this.session = body.session;
    return body;
  }

  async resumeOrStart({ participantCode = '' } = {}) {
    try {
      const current = await this.request('/session');
      if (!current?.session?.id || !current?.session?.status) {
        throw new Error('Study API returned an invalid session response. Check that the frontend proxy points to this project’s study server.');
      }
      this.session = current.session;
      return current;
    } catch (error) {
      if (error.status !== 401) throw error;
      const created = await this.request('/sessions', {
        method: 'POST',
        body: JSON.stringify({ participantCode })
      });
      if (!created?.session?.id || !created?.session?.status) {
        throw new Error('Study API did not create a session. Check the study server and Google Drive configuration.');
      }
      return { ...created, artifacts: [] };
    }
  }

  savePermission(permission) {
    return this.request('/permission', { method: 'POST', body: JSON.stringify(permission) });
  }

  saveAssent(assent) {
    return this.request('/assent', { method: 'POST', body: JSON.stringify(assent) });
  }

  uploadVideo(blob, metadata) {
    return this.request('/video', {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': blob.type || 'video/webm',
        'X-Video-Label': metadata.label,
        'X-Video-Sequence': String(metadata.sequence),
        'X-Video-Start-Ms': String(metadata.startedAtMs ?? ''),
        'X-Video-End-Ms': String(metadata.endedAtMs ?? '')
      }
    });
  }

  saveCheckpoint(sequence, checkpoint) {
    return this.request(`/checkpoints/${sequence}`, {
      method: 'PUT',
      body: JSON.stringify(checkpoint)
    });
  }

  complete(finalData) {
    return this.request('/complete', { method: 'POST', body: JSON.stringify(finalData) });
  }

  requestWithdrawalLink(parentEmail) {
    return this.request('/withdrawal-link', {
      method: 'POST',
      body: JSON.stringify({ parentEmail })
    });
  }

  saveParentDecision(decision) {
    return this.request('/parent-decision', {
      method: 'POST',
      body: JSON.stringify(decision)
    });
  }

  withdraw() {
    return this.request('/withdraw', { method: 'POST', body: JSON.stringify({}) });
  }
}
