import { GameApplication } from './src/core/GameApplication.js';
import { CONFIG } from './src/config/gameConfig.js';
import { SelfHostedStudyManager } from './src/study/SelfHostedStudyManager.js';

// Initialize the application
const appContainer = document.getElementById('app');
const studyManager = CONFIG.study.enabled ? new SelfHostedStudyManager(appContainer) : null;
try { window.__SELF_HOSTED_STUDY__ = studyManager; } catch (_) { /* ignore */ }
const app = new GameApplication(appContainer, studyManager);

// Handle different startup modes
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'human-ai';
const experimentType = urlParams.get('experiment') || '2P2G';
const roomId = urlParams.get('room');

console.log('Starting application with:', { mode, experimentType, roomId });

// Wait for DOM and dependencies to load
document.addEventListener('DOMContentLoaded', async () => {
  // Start the application
  if (studyManager) {
    try {
      const shouldStart = await studyManager.prepare();
      if (!shouldStart) return;
    } catch (error) {
      console.error('Failed to prepare self-hosted study:', error);
      if (!String(error?.message || '').includes('did not assent')) {
        appContainer.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f8f9fa;padding:24px;">
            <div style="max-width:620px;background:#fff;padding:30px;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.12);text-align:center;">
              <h2>Study setup could not be completed</h2>
              <p>${String(error?.message || 'Please retry or contact the research team.')}</p>
              <button onclick="window.location.reload()" style="padding:11px 20px;font-size:16px;">Retry</button>
            </div>
          </div>`;
      }
      return;
    }
  }
  app.start({
    mode: studyManager ? 'human-ai' : mode,
    experimentType,
    roomId
  }).catch(error => {
    console.error('Failed to start application:', error);
    appContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh;">
        <div style="text-align: center; color: #666;">
          <h2>Error</h2>
          <p>Failed to start the experiment: ${error.message}</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; font-size: 16px;">
            Retry
          </button>
        </div>
      </div>
    `;
  });
});
