import { GameApplication } from './GameApplication.js';
import { CONFIG, GameConfigUtils } from '../config/gameConfig.js';
import { GameHelpers } from '../utils/GameHelpers.js';

// Opt-in local play: two humans, one shared map sequence, no research forms.
export class LanGameApplication extends GameApplication {
  constructor(container) {
    super(container);
    CONFIG.server.enableGoogleDriveSave = false;
    CONFIG.game.players.player1.type = 'human';
    CONFIG.game.players.player2.type = 'human';
    CONFIG.game.experiments.order = ['StagHunt'];
    CONFIG.game.experiments.numTrials.StagHunt = 16;
    CONFIG.game.experiments.stagHuntPhaseRounds = [16];
    CONFIG.game.experiments.mapOrder.StagHunt = 'fixed';
    CONFIG.game.timing.maxTrialDurationMs = 0;
    CONFIG.multiplayer.synchronizedHumanTurns = true;
    CONFIG.multiplayer.inactivityFallback.enabled = false;
    this.lanReady = new Set();
    this.lanLocalTrial = null;
    this.lanActive = false;
    this.lanPending = [null, null];
  }

  async startTimelineFlow(_mode, _experiment, roomId) {
    if (!this.networkManager?.isConnected) throw new Error('Cannot connect to the local game server.');
    // Local two-human play uses all main maps, including round zero.
    // The study's new solo introduction applies only to its onboarding flow.
    this.experimentManager.getTrialDesign = async (type, trialIndex) => {
      const manager = this.experimentManager;
      await manager.ensureMapDataLoaded();
      if (!manager.sampledMapsByExperiment[type]) {
        manager.sampledMapsByExperiment[type] = manager.mapLoader.selectRandomMaps(
          manager.mapLoader.getMapsForExperiment(type), 16, type);
      }
      return { ...manager.sampledMapsByExperiment[type][trialIndex], playerStartPositionsSwapped: false };
    };
    const tm = this.timelineManager;
    tm.createTimelineStages = () => {
      tm.stages = [];
      for (let i = 0; i < 16; i++) {
        tm.addTrialStages('StagHunt', 0, i, { fullTitle: GameConfigUtils.getStagHuntGameRoundTitle(i) });
      }
      tm.stages.push({ type: 'lan-complete', handler: () => {
        this.lanActive = false;
        this.timelineManager.experimentData.completed = true;
        this.persistResearchSnapshot('lan_complete');
        this.container.innerHTML = '<main style="padding:48px;text-align:center"><h1>All 16 rounds complete!</h1><p>Thanks for playing together.</p><p>To play again, close this game on both devices, then reopen the shared link.</p></main>';
      }});
    };
    const beginTrial = this.experimentManager.startTimelineTrialExecution.bind(this.experimentManager);
    this.experimentManager.startTimelineTrialExecution = type => {
      beginTrial(type);
      this.lanPending = [null, null];
      this.lanLocalTrial = this.gameStateManager.currentState.trialIndex;
      this.gameStateManager.trialData.humanPlayerIndex = this.playerIndex;
      this.lanActive = true;
      this.lanSend({ type: 'lan-ready', trial: this.lanLocalTrial });
      this.lanStatus();
    };
    this.container.innerHTML = `<main style="max-width:680px;margin:60px auto;padding:24px;text-align:center">
      <h1>Play together</h1><p>Open this same link on the other player's device.</p>
      <p>Use the arrow keys. Each turn happens after both players choose a legal move.</p>
      <p>Reach a small kitchen alone for one cupcake, or the same big kitchen together for five each.</p>
      <p id="lan-lobby-status">Waiting for the other player…</p>
      <button id="lan-start" disabled style="padding:16px 32px;font-size:20px">Ready to play</button>
      </main>`;
    const enable = () => {
      const status = document.getElementById('lan-lobby-status');
      const button = document.getElementById('lan-start');
      if (status) status.textContent = `Both players connected. You are ${this.playerIndex === 0 ? 'Red' : 'Purple'}.`;
      if (button) button.disabled = false;
    };
    this.networkManager.on('room-full', enable);
    this.networkManager.on('game-started', () => {
      tm.createTimelineStages();
      tm.currentStageIndex = 0;
      tm.runCurrentStage();
    });
    document.getElementById('lan-start').onclick = event => {
      event.target.disabled = true;
      event.target.textContent = 'Waiting for the other player…';
      this.networkManager.setMatchPlayReady();
    };
    await this.networkManager.joinRoom({ roomId: roomId || 'lan-cake', gameMode: 'human-human', experimentType: 'StagHunt' });
  }

  setupNetworkEventHandlers() {
    super.setupNetworkEventHandlers();
    // LAN play pauses instead of silently substituting an AI partner.
    this.networkManager.eventHandlers.set('player-disconnected', [() => {
      this.lanActive = false;
      if (!this.gameStateManager.trialData._finalized && this.gameStateManager.trialData.trialId) {
        this.gameStateManager.finalizeTrial(false, { terminationReason: 'partner_disconnect' });
      }
      this.persistResearchSnapshot('partner_disconnect');
      this.experimentManager.clearGameIntervals();
      this.experimentManager.cakeVisualization.hide();
      this.container.innerHTML = '<main style="padding:48px;text-align:center"><h1>Your partner disconnected</h1><p>Close this game on both devices, then reopen the shared link to start a new game.</p></main>';
    }]);
  }

  lanSend(action) { this.networkManager.sendGameAction(action); }

  lanStatus(message = null) {
    const canvas = document.getElementById('game-canvas-container');
    if (!canvas) return;
    let status = document.getElementById('lan-turn-status');
    if (!status) {
      status = document.createElement('p');
      status.id = 'lan-turn-status';
      status.style.cssText = 'font-size:15px;color:#333;margin:8px';
      canvas.after(status);
    }
    status.textContent = message || (!this.lanReady.has(this.lanLocalTrial)
      ? 'Waiting for the other player to load this round…'
      : 'Choose a move with the arrow keys. Both players move together.');
  }

  async handleHumanHumanSynchronizedMove(direction) {
    if (!this.lanActive || !this.lanReady.has(this.lanLocalTrial)) return;
    const gs = this.gameStateManager;
    if (!gs.isLegalSynchronizedDirection(this.playerIndex + 1, direction)) {
      gs.recordEvent('input_rejected', { actor: this.playerIndex + 1, direction, reason: 'illegal_move' });
      this.lanStatus('That move is blocked. Choose another direction.');
      return;
    }
    gs.recordEvent('input_accepted', { actor: this.playerIndex + 1, direction, clock: 'local_device' });
    const action = { type: 'lan-move', trial: this.lanLocalTrial, step: gs.stepCount, direction };
    this.lanPending[this.playerIndex] = direction;
    this.lanStatus('Move selected. Waiting for the other player…');
    if (this.playerIndex === 0) this.lanResolve();
    else this.lanSend(action);
  }

  handleRemotePlayerAction({ action }) {
    if (action.type === 'lan-ready') {
      this.lanReady.add(action.trial);
      this.lanStatus();
      return;
    }
    if (!this.lanActive || action.trial !== this.lanLocalTrial || action.step !== this.gameStateManager.stepCount) return;
    if (action.type === 'lan-move' && this.playerIndex === 0) {
      if (!this.gameStateManager.isLegalSynchronizedDirection(2, action.direction)) return;
      this.gameStateManager.recordEvent('remote_input_received', { actor: 2, direction: action.direction, clock: 'host_device' });
      this.lanPending[1] = action.direction;
      this.lanResolve();
    } else if (action.type === 'lan-commit' && this.playerIndex === 1) {
      this.lanApply(action);
    }
  }

  lanResolve() {
    const gs = this.gameStateManager;
    const state = gs.currentState;
    const moves = this.lanPending.map((move, i) =>
      GameHelpers.isGoalReached(state[i === 0 ? 'player1' : 'player2'], state.currentGoals) ? 'up' : move);
    if (!moves.every(Boolean)) return;
    if (gs.validateSynchronizedDirections(...moves)) return;
    const action = { type: 'lan-commit', trial: this.lanLocalTrial, step: gs.stepCount, moves };
    this.lanSend(action);
    this.lanApply(action);
  }

  lanApply(action) {
    // Committed turns are ordered by trial/step, so a device-local key throttle
    // must not discard a turn on one client while accepting it on the other.
    this.gameStateManager.isMoving = false;
    const result = this.gameStateManager.processSynchronizedMoves(...action.moves);
    this.lanPending = [null, null];
    this.uiManager.updateGameDisplay(this.gameStateManager.getCurrentState());
    this.lanStatus();
    if (result.trialComplete) {
      this.lanActive = false;
      this.experimentManager.handleTrialComplete(result);
    }
  }
}
