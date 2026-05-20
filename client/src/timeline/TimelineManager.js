import { CONFIG, GameConfigUtils } from '../config/gameConfig.js';

/**
 * Timeline Manager - Orchestrates the complete experiment flow
 * Matches the legacy expTimeline.js structure exactly
 */
export class TimelineManager {
  constructor(container) {
    this.container = container;
    this.stages = [];
    this.currentStageIndex = 0;
    this.mapData = {};
    // Track whether we've already shown the partner-finding stage
    this.hasShownPartnerFindingStage = false;
    this.waitingTimes = []; // Store waiting time records for export
    this.experimentData = {
      participantId: this.getParticipantId(),
      lookitResponseId: this.getLookitResponseId(),
      lookitChildId: this.getLookitChildId(),
      startTime: new Date().toISOString(),
      // consentTime: null,
      experiments: {},
      questionnaire: {},
      participantDob: null,
      participantAgeReferenceDate: null,
      participantAgeYears: null,
      participantAgeMonths: null,
      participantAgeDays: null,
      participantAgeTotalDays: null,
      parentEmail: null,
      parentEmailUse: 'payment_and_child_certificate_only',
      dataSaveCheckpointTimes: {},
      totalScore: 0,
      completed: false
    };
    this.eventHandlers = new Map();
    this.requestedDataSaveCheckpoints = new Set();

    // Success threshold tracking for collaboration experiments
    this.successThreshold = {
      consecutiveSuccesses: 0,
      totalTrialsCompleted: 0,
      experimentEndedEarly: false,
      lastSuccessTrial: -1,
      successHistory: []
    };

    // Map synchronization for multiplayer
    this.sharedMapData = {};
    this.isMapHost = false;
    this.pendingMapSync = false;

    // Player information for multiplayer games
    this.playerIndex = 0; // Default to player 0 (red)
    this.gameMode = 'human-ai'; // Default game mode
  }

  // Event system
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in timeline event handler for ${event}:`, error);
        }
      });
    }
  }

  // Set player information for multiplayer games
  setPlayerInfo(playerIndex, gameMode) {
    this.playerIndex = playerIndex;
    this.gameMode = gameMode;
    console.log(`🎮 TimelineManager: Set player info - Player ${playerIndex + 1} (${playerIndex === 0 ? 'red' : 'purple'}) in ${gameMode} mode`);
  }

  /**
   * Create the complete timeline stages matching legacy structure
   */
  createTimelineStages() {
    this.stages = [];

    console.log('📋 Creating comprehensive timeline stages...');

    // 1. Consent form (COMMENTED OUT)
    // this.stages.push({
    //   type: 'consent',
    //   handler: () => this.showConsentStage()
    // });

    // 1. Start page
    this.stages.push({
      type: 'start',
      handler: () => this.showStartStage()
    });

    // 2. Welcome info
    this.stages.push({
      type: 'welcome_info',
      handler: () => this.showWelcomeInfoStage()
    });

    // 3-6. Add stages for each experiment in order
    const experimentOrder = CONFIG.game.experiments.order;
    for (let expIndex = 0; expIndex < experimentOrder.length; expIndex++) {
      const experimentType = experimentOrder[expIndex];
      const numTrials = GameConfigUtils.getNumTrials(experimentType);

      console.log(`📋 Adding stages for experiment: ${experimentType}`);

      // Instructions for this experiment
      this.stages.push({
        type: 'instructions',
        experimentType: experimentType,
        experimentIndex: expIndex,
        handler: () => this.showInstructionsStage(experimentType, expIndex)
      });

      // For Game 3 (2P2G), insert a comprehension check right after the instructions
      // before any multiplayer waiting/match-play or trials begin.
      if (experimentType === '2P2G') {
        this.stages.push({
          type: 'comprehension_check',
          experimentType: experimentType,
          experimentIndex: expIndex,
          handler: () => this.showComprehensionCheckStage(experimentType, expIndex)
        });
      }

      // Waiting room only for true human-human multiplayer experiments
      // For human-AI mode, 2P experiments run with AI as the second player
      const isMultiplayer = experimentType.includes('2P');
      console.log(`🔍 Experiment ${experimentType}: isMultiplayer=${isMultiplayer}`);

      if (isMultiplayer) {
        // Only show the partner-finding (waiting) stage once across all 2P games
        if (!this.hasShownPartnerFindingStage) {
          console.log(`➕ Adding waiting + match-play stages for ${experimentType}`);
          // Stage 1: Waiting for partner (spinner + status)
          this.stages.push({
            type: 'waiting_for_partner',
            experimentType: experimentType,
            experimentIndex: expIndex,
            handler: () => this.showWaitingForPartnerStage(experimentType, expIndex)
          });
          // Stage 2: Match play gate (Game is Ready! press space)
          this.stages.push({
            type: 'match_play',
            experimentType: experimentType,
            experimentIndex: expIndex,
            showPartnerFoundMessage: true,
            handler: () => this.showMatchPlayStage(experimentType, expIndex)
          });
          this.hasShownPartnerFindingStage = true;
        } else {
          console.log(`➕ Skipping waiting and match-play stages for ${experimentType}; checking partner presence only`);
          // For subsequent 2P experiments (e.g., Game 4), do NOT show "Game is Ready" again.
          // Only check if the partner is still connected before proceeding directly to trials.
          this.stages.push({
            type: 'check_partner_presence',
            experimentType: experimentType,
            experimentIndex: expIndex,
            handler: () => this.checkPartnerPresenceAndProceed(experimentType, expIndex)
          });
        }
      }

      // Add trial stages (fixation -> trial -> feedback sequence)
      if (experimentType.includes('2P') && CONFIG.game.successThreshold.enabled) {
        // Dynamic collaboration stages
        this.addCollaborationExperimentStages(experimentType, expIndex);
      } else {
        // Fixed number of trials
        for (let i = 0; i < numTrials; i++) {
          this.addTrialStages(experimentType, expIndex, i);
        }
      }
    }

    // 7. Game performance feedback
    // this.stages.push({
    //   type: 'game-feedback',
    //   handler: () => this.showGameFeedbackStage()
    // });

    // 8. Post-questionnaire
    this.stages.push({
      type: 'questionnaire',
      handler: () => this.showQuestionnaireStage()
    });

    // 9. End info with data saving
    this.stages.push({
      type: 'end-info',
      handler: () => this.showEndExperimentInfoStage()
    });

    // 10. Prolific redirect (DISABLED)
    // this.stages.push({
    //   type: 'prolific-redirect',
    //   handler: () => this.showProlificRedirectStage()
    // });

    console.log(`📋 Timeline created with ${this.stages.length} total stages`);
    console.log('📋 Stages:', this.stages.map((stage, index) => `${index}: ${stage.type}`).join(', '));
  }

  /**
   * Add trial stages: fixation -> trial -> post-trial feedback
   */
  addTrialStages(experimentType, experimentIndex, trialIndex) {
    // Fixation screen
    this.stages.push({
      type: 'fixation',
      experimentType: experimentType,
      experimentIndex: experimentIndex,
      trialIndex: trialIndex,
      handler: () => this.showFixationStage(experimentType, experimentIndex, trialIndex)
    });

    // Main trial
    this.stages.push({
      type: 'trial',
      experimentType: experimentType,
      experimentIndex: experimentIndex,
      trialIndex: trialIndex,
      handler: () => this.runTrialStage(experimentType, experimentIndex, trialIndex)
    });

    // Post-trial feedback
    this.stages.push({
      type: 'post-trial',
      experimentType: experimentType,
      experimentIndex: experimentIndex,
      trialIndex: trialIndex,
      handler: () => this.showPostTrialStage(experimentType, experimentIndex, trialIndex)
    });
  }

  /**
   * Add collaboration experiment stages with dynamic success threshold
   */
  addCollaborationExperimentStages(experimentType, experimentIndex) {
    // Initialize success threshold tracking for this experiment
    this.initializeSuccessThresholdTracking();

    // Add initial trial stages - more will be added dynamically based on performance
    this.addTrialStages(experimentType, experimentIndex, 0);
  }

  /**
   * Start the timeline
   */
  start() {
    this.createTimelineStages();
    this.currentStageIndex = this.shouldSkipDobInput() ? 1 : 0;
    if (this.currentStageIndex === 1) {
      console.log('🧪 DOB input skipped by test URL parameter');
    }
    this.runCurrentStage();
  }

  /**
   * Run the current stage
   */
  runCurrentStage() {
    if (this.currentStageIndex >= this.stages.length) {
      console.log('🏁 Timeline completed!');
      return;
    }

    const stage = this.stages[this.currentStageIndex];
    console.log(`🎬 Running stage ${this.currentStageIndex}: ${stage.type}`);

    try {
      if (stage.type === 'questionnaire') {
        const gamesCompletedAt = new Date().toISOString();
        this.experimentData.gamesCompletedAt = this.experimentData.gamesCompletedAt || gamesCompletedAt;
        this.requestDataSaveCheckpoint('games_complete', {
          gamesCompletedAt: this.experimentData.gamesCompletedAt
        });
      }
      stage.handler();
    } catch (error) {
      console.error(`❌ Error running stage ${stage.type}:`, error);
      this.nextStage();
    }
  }

  /**
   * Advance to next stage
   */
  nextStage() {
    console.log(`➡️ Advancing from stage ${this.currentStageIndex} to ${this.currentStageIndex + 1}`);
    this.currentStageIndex++;
    this.runCurrentStage();
  }

  requestDataSaveCheckpoint(checkpoint, extraData = {}) {
    if (!checkpoint || this.requestedDataSaveCheckpoints.has(checkpoint)) {
      return;
    }

    this.requestedDataSaveCheckpoints.add(checkpoint);
    const checkpointTime = new Date().toISOString();
    this.experimentData.dataSaveCheckpointTimes = {
      ...(this.experimentData.dataSaveCheckpointTimes || {}),
      [checkpoint]: checkpointTime
    };
    Object.assign(this.experimentData, extraData);

    console.log(`💾 Requesting background data save checkpoint: ${checkpoint}`);
    this.emit('save-data-checkpoint', {
      checkpoint,
      checkpointTime,
      data: {
        ...this.experimentData,
        saveCheckpoint: checkpoint,
        saveCheckpointTime: checkpointTime
      }
    });
  }

  /**
   * Stage Implementations
   */

  showConsentStage() {
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="max-width: 800px; margin: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 40px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Informed Consent for Research Participation</h1>

          <div style="max-height: 400px; overflow-y: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 30px; background: #fafafa;">
            <h3>Key Information</h3>
            <p>This consent form asks you to take part in a research study. This study is conducted by researchers at Duke University and UCLA.</p>

            <h4>Purpose</h4>
            <p>The purpose of this study is to investigate how people make decisions.</p>

            <h4>What you will be asked to do</h4>
            <p>You will be playing a series of navigation games on a 2D grid map. Afterward, you will complete some questionnaires regarding your game experience. The study will take approximately 10 minutes to complete.</p>

            <h4>Benefits and Risks</h4>
            <p>There are no foreseen risks or benefits for participating in this study. Should any of the content cause you distress at any point throughout the study, you may stop at any time.</p>

            <h4>Confidentiality</h4>
            <p>We do not ask for your name or any other information that might identify you. Although collected data may be made public or used for future research purposes, your identity will always remain confidential.</p>

            <h4>Voluntary nature of participation</h4>
            <p>Your participation in this research study is voluntary. You may withdraw at any time and you may choose not to answer any question, but you must proceed to the final screen of the study in order to receive your completion code, which you must submit in order to be paid.</p>

            <h4>Compensation</h4>
            <p>You will receive $3 for your participation in this study, and an additional bonus (up to $1) if you finish the task beyond a certain threshold.</p>

            <h4>Contact Information</h4>
            <p>For questions about the study or for research-related complaints, concerns or suggestions about the research, contact Dr. Tamar Kushnir at (919) 660-5640 during regular business hours. For questions about your rights as a participant contact the Duke Campus Institutional Review Board at campusirb@duke.edu. Please reference Protocol ID# 2024-0427 in your email.</p>

            <h4>Agreement</h4>
            <p>By clicking the button below, you acknowledge that your participation in the study is voluntary, you are 18 years of age or older, and that you are aware that you may choose to terminate your participation in the study at any time and for any reason.</p>
          </div>

          <div style="text-align: center;">
            <label style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 16px;">
              <input type="checkbox" id="consentCheckbox" style="margin-right: 10px; transform: scale(1.2);">
              I have read and understood the above information, and I consent to participate in this study.
            </label>

            <button id="continueBtn" disabled style="background: #28a745; color: white; border: none; padding: 12px 30px; font-size: 16px; border-radius: 5px; cursor: not-allowed; margin-right: 10px;">
              Continue to Experiment
            </button>

            <button onclick="window.close()" style="background: #dc3545; color: white; border: none; padding: 12px 30px; font-size: 16px; border-radius: 5px; cursor: pointer;">
              Decline and Exit
            </button>
          </div>
        </div>
      </div>
    `;

    // Add interactivity
    const checkbox = document.getElementById('consentCheckbox');
    const continueBtn = document.getElementById('continueBtn');

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        continueBtn.disabled = false;
        continueBtn.style.cursor = 'pointer';
        continueBtn.style.background = '#28a745';
      } else {
        continueBtn.disabled = true;
        continueBtn.style.cursor = 'not-allowed';
        continueBtn.style.background = '#6c757d';
      }
    });

    continueBtn.addEventListener('click', () => {
      if (!checkbox.checked) return;

      this.experimentData.consentTime = new Date().toISOString();
      console.log('✅ Consent obtained');
      this.nextStage();
    });
  }

  showStartStage() {
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 36px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 560px; width: calc(100% - 40px); text-align: center;">
          <h2 style="color: #333; margin: 0 0 12px; font-size: 28px;">Welcome to the Game!</h2>
          <p style="font-size: 16px; color: #444; line-height: 1.5; margin: 0 0 24px;">
            Please enter your kid's date of birth and a parent email to start the game.
          </p>

          <form id="dobStartForm" style="display: flex; flex-direction: column; gap: 18px; align-items: stretch;">
            <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; text-align: left;">
              <label style="font-weight: bold; color: #333;">
                Month
                <select id="dobMonth" required style="width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #bbb; border-radius: 6px; font-size: 16px; background: white;">
                  <option value="">Month</option>
                  ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                </select>
              </label>
              <label style="font-weight: bold; color: #333;">
                Day
                <select id="dobDay" required style="width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #bbb; border-radius: 6px; font-size: 16px; background: white;">
                  <option value="">Day</option>
                  ${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                </select>
              </label>
              <label style="font-weight: bold; color: #333;">
                Year
                <select id="dobYear" required style="width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #bbb; border-radius: 6px; font-size: 16px; background: white;">
                  <option value="">Year</option>
                  ${Array.from({ length: 2024 - 2018 + 1 }, (_, i) => 2018 + i).map(year => `<option value="${year}">${year}</option>`).join('')}
                </select>
              </label>
            </div>

            <label style="font-weight: bold; color: #333; text-align: left;">
              Parent email
              <input id="parentEmail" type="email" required autocomplete="email" placeholder="parent@example.com" style="box-sizing: border-box; width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #bbb; border-radius: 6px; font-size: 16px;">
            </label>

            <p style="font-size: 14px; color: #555; line-height: 1.45; margin: -6px 0 0; text-align: left;">
              Your email will be used only to send your child’s certificate and study payment.
            </p>

            <div id="dobError" role="alert" style="min-height: 22px; color: #dc3545; font-size: 15px; text-align: center;"></div>

            <button id="startBtn" type="submit" style="align-self: center; background: #28a745; color: white; border: none; padding: 16px 52px; font-size: 22px; font-weight: bold; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.3s;">
              Start
            </button>
          </form>
        </div>
      </div>
    `;

    const form = document.getElementById('dobStartForm');
    const startBtn = document.getElementById('startBtn');
    const errorEl = document.getElementById('dobError');
    const setError = (message) => {
      if (errorEl) errorEl.textContent = message || '';
    };
    
    startBtn.addEventListener('mouseenter', () => {
      startBtn.style.background = '#218838';
    });
    
    startBtn.addEventListener('mouseleave', () => {
      startBtn.style.background = '#28a745';
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const year = Number(document.getElementById('dobYear')?.value);
      const month = Number(document.getElementById('dobMonth')?.value);
      const day = Number(document.getElementById('dobDay')?.value);
      const parentEmail = String(document.getElementById('parentEmail')?.value || '').trim();
      const dob = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const ageInfo = this.calculateAgeFromDob(dob, new Date());

      if (!ageInfo) {
        setError('Please enter a real date of birth that is not in the future.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
        setError('Please enter a valid parent email address.');
        return;
      }

      Object.assign(this.experimentData, {
        ...ageInfo,
        parentEmail,
        parentEmailUse: 'payment_and_child_certificate_only'
      });
      if (startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = 'Starting...';
        startBtn.style.cursor = 'default';
        startBtn.style.background = '#28a745';
      }
      this.requestDataSaveCheckpoint('start_info_collected');
      this.nextStage();
    });

    document.getElementById('dobMonth')?.focus();
  }

  showWelcomeInfoStage() {
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <style>
          @keyframes welcomeArrowBounce {
            0%, 100% { transform: translate(-50%, -5px); }
            50% { transform: translate(-50%, 7px); }
          }
        </style>
        <div style="background: white; padding: 36px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: calc(100% - 48px); max-width: 1120px; text-align: center;">
          <h2 style="color: #333; margin: 0 0 24px; font-size: 36px;">Welcome to the Game!</h2>
          
          <div style="display: flex; justify-content: center; align-items: stretch; gap: 24px; flex-wrap: wrap; margin: 0 auto;">
            <div style="flex: 1 1 640px; min-width: 0; background: #f8fbff; border: 2px solid #007bff; border-radius: 12px; padding: 18px; text-align: center;">
              <h3 style="color: #1f2937; margin: 0 0 16px; font-size: 22px; line-height: 1.3;">
                <span style="display: block;">Hungry travelers need to reach restaurants</span>
                <span style="display: block;">as quickly as possible!</span>
              </h3>
              <div style="display: flex; justify-content: center; align-items: center; gap: 22px; flex-wrap: wrap;">
                <div style="display: flex; justify-content: center; align-items: center; gap: 18px; flex-wrap: wrap;">
                  <div aria-label="Example game map" style="display: grid; grid-template-columns: repeat(5, 36px); grid-template-rows: repeat(5, 36px); gap: 3px; border: 2px solid #2f3a4a; padding: 7px; background: white; border-radius: 9px; box-shadow: 0 4px 10px rgba(0,0,0,0.06);">
                    ${Array.from({ length: 25 }, (_, i) => {
                      const goal = i === 3;
                      const player = i === 11;
                      const bg = goal ? '#007bff' : (player ? 'red' : '#f8f9fa');
                      const radius = goal ? '4px' : (player ? '50%' : '0');
                      const shadow = player ? 'box-shadow: 0 2px 5px rgba(255,0,0,0.25);' : '';
                      return `<div style="background: ${bg}; border: 1px solid #d7dde6; border-radius: ${radius}; ${shadow}"></div>`;
                    }).join('')}
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 10px; font-size: 18px; color: #333; text-align: left;">
                    <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 20px; height: 20px; background: red; border-radius: 50%;"></div><span>Traveler</span></div>
                    <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 20px; height: 20px; background: #007bff; border-radius: 4px;"></div><span>Restaurant</span></div>
                  </div>
                </div>

                <div style="display: flex; justify-content: center; align-items: center;">
                  <div style="display: grid; grid-template-columns: 220px 176px; grid-template-rows: 54px 54px 24px; column-gap: 18px; row-gap: 7px; align-items: start; justify-content: center;">
                    <div aria-label="Space bar" style="grid-column: 1; grid-row: 2; position: relative; width: 220px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 18px; font-weight: bold; letter-spacing: 1px; color: #222;">
                      <div id="welcomeSpacebarPrompt" aria-hidden="true" style="display: none; position: absolute; left: 50%; top: -56px; width: 34px; height: 50px; pointer-events: none; animation: welcomeArrowBounce 0.8s ease-in-out infinite;">
                        <div style="width: 6px; height: 32px; margin: 0 auto; background: #28a745; border-radius: 999px;"></div>
                        <div style="width: 0; height: 0; margin: -1px auto 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-top: 18px solid #28a745;"></div>
                      </div>
                      SPACE BAR
                    </div>
                    <div style="grid-column: 1; grid-row: 3; color: #475467; font-size: 15px; text-align: center;">start or continue</div>
                    <div aria-label="Arrow keys" style="grid-column: 2; grid-row: 1 / span 2; display: grid; grid-template-columns: repeat(3, 54px); grid-template-rows: repeat(2, 54px); gap: 7px;">
                      <div></div>
                      <div style="width: 54px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 30px; font-weight: bold; color: #1f2937;">&uarr;</div>
                      <div></div>
                      <div style="width: 54px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 30px; font-weight: bold; color: #1f2937;">&larr;</div>
                      <div style="width: 54px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 30px; font-weight: bold; color: #1f2937;">&darr;</div>
                      <div style="width: 54px; height: 54px; border: 2px solid #bac7d6; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 0 #d7dde6; font-size: 30px; font-weight: bold; color: #1f2937;">&rarr;</div>
                    </div>
                    <div style="grid-column: 2; grid-row: 3; color: #475467; font-size: 15px; text-align: center;">move your traveler</div>
                  </div>
                </div>
              </div>

            </div>

            <div style="flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
              <video 
                id="welcomeVideo"
                width="100%" 
                height="360"
                controls
                autoPlay
                playsInline
                style="display: block; width: 100%; height: auto; max-height: 420px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background: #000;">
                <source src="${this.assetUrl('video1.mp4')}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    `;

    // Start the welcome video with sound. If autoplay audio is blocked, keep the video playing
    // and retry sound on the next user interaction.
    const welcomeVideo = document.getElementById('welcomeVideo');
    const spacebarPrompt = document.getElementById('welcomeSpacebarPrompt');
    let welcomeVideoComplete = !welcomeVideo;
    const showSpacebarPrompt = () => {
      welcomeVideoComplete = true;
      if (spacebarPrompt) {
        spacebarPrompt.style.display = 'block';
      }
    };

    if (welcomeVideo) {
      welcomeVideo.addEventListener('ended', showSpacebarPrompt, { once: true });
      // Do not trap participants if the video cannot load.
      welcomeVideo.addEventListener('error', showSpacebarPrompt, { once: true });
      if (welcomeVideo.ended) {
        showSpacebarPrompt();
      }
    } else {
      showSpacebarPrompt();
    }

    if (welcomeVideo) {
      welcomeVideo.autoplay = true;
      welcomeVideo.playsInline = true;
      welcomeVideo.defaultMuted = false;
      welcomeVideo.muted = false;
      welcomeVideo.volume = 1;

      const tryPlayWithSound = () => {
        welcomeVideo.muted = false;
        welcomeVideo.volume = 1;
        return welcomeVideo.play();
      };

      const enableSoundOnFirstInteraction = () => {
        tryPlayWithSound().catch((err) => {
          console.warn('Unable to start welcome video with sound after interaction:', err);
        });
        document.removeEventListener('click', enableSoundOnFirstInteraction);
        document.removeEventListener('keydown', enableSoundOnFirstInteraction);
        welcomeVideo.removeEventListener('click', enableSoundOnFirstInteraction);
      };

      tryPlayWithSound().catch((err) => {
        console.warn('Unable to autoplay welcome video with sound, falling back to muted:', err);
        welcomeVideo.muted = true;
        welcomeVideo.play().catch((err2) => {
          console.warn('Unable to autoplay muted welcome video:', err2);
        });
        document.addEventListener('click', enableSoundOnFirstInteraction, { once: true });
        document.addEventListener('keydown', enableSoundOnFirstInteraction, { once: true });
        welcomeVideo.addEventListener('click', enableSoundOnFirstInteraction, { once: true });
      });
    }

    // Handle spacebar to continue (matching legacy)
    const handleSpacebar = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        // Use capture + preventDefault so space doesn't play/pause the video
        event.preventDefault();
        event.stopPropagation();
        if (!welcomeVideoComplete) return;
        document.removeEventListener('keydown', handleSpacebar, true);
        console.log('🎮 Starting game sequence');
        this.nextStage();
      }
    };

    // Capture phase ensures we intercept before focused elements (like <video>) handle spacebar.
    document.addEventListener('keydown', handleSpacebar, true);
    document.body.focus();
  }

  showInstructionsStage(experimentType, experimentIndex) {
    const instructions = this.getInstructionsForExperiment(experimentType);

    this.container.innerHTML = instructions.html;

    // For Game 1, Game 2, Game 3 and Game 4 instruction videos:
    // - First try to autoplay WITH sound (by this point the child has already interacted with the page)
    // - If the browser blocks that, fall back to muted autoplay and enable sound on first interaction
    let instructionVideo = null;
    if (experimentType === '1P1G' || experimentType === '1P2G' || experimentType === '2P2G' || experimentType === '2P3G') {
      instructionVideo =
        document.getElementById('game1Video') ||
        document.getElementById('game2Video') ||
        document.getElementById('game3Video') ||
        document.getElementById('game4Video') ||
        this.container.querySelector('video');

      if (instructionVideo) {
        instructionVideo.autoplay = true;
        instructionVideo.playsInline = true;

        const tryPlayWithSound = () => {
          instructionVideo.muted = false;
          instructionVideo.volume = 1;
          return instructionVideo.play();
        };

        tryPlayWithSound().catch((err) => {
          console.warn('Unable to autoplay instruction video with sound, falling back to muted:', err);

          // Fallback: muted autoplay + enable sound on first interaction
          instructionVideo.muted = true;
          instructionVideo.play().catch((err2) => {
            console.warn('Unable to autoplay muted instruction video:', err2);
          });

          const enableSoundOnFirstInteraction = () => {
            instructionVideo.muted = false;
            instructionVideo.volume = 1;
            instructionVideo.play().catch((err3) => {
              console.warn('Unable to start instruction video with sound after interaction:', err3);
            });
            document.removeEventListener('click', enableSoundOnFirstInteraction);
            document.removeEventListener('keydown', enableSoundOnFirstInteraction);
            instructionVideo.removeEventListener('click', enableSoundOnFirstInteraction);
          };

          document.addEventListener('click', enableSoundOnFirstInteraction, { once: true });
          document.addEventListener('keydown', enableSoundOnFirstInteraction, { once: true });
          instructionVideo.addEventListener('click', enableSoundOnFirstInteraction, { once: true });
        });
      }
    }

    const instructionContinuePanel = document.getElementById('instructionContinuePanel');
    const instructionContinueBtn = document.getElementById('instructionContinueBtn');
    let instructionVideoComplete = !instructionVideo;
    let instructionAdvanced = false;
    const markInstructionVideoComplete = () => {
      instructionVideoComplete = true;
      if (instructionContinuePanel) {
        instructionContinuePanel.style.display = 'block';
      }
      if (instructionContinueBtn) {
        instructionContinueBtn.disabled = false;
        instructionContinueBtn.style.cursor = 'pointer';
        instructionContinueBtn.style.opacity = '1';
      }
    };

    if (instructionVideo) {
      instructionVideo.addEventListener('ended', markInstructionVideoComplete, { once: true });
      // Do not trap participants if the video cannot load.
      instructionVideo.addEventListener('error', markInstructionVideoComplete, { once: true });
      if (instructionVideo.ended) {
        markInstructionVideoComplete();
      }
    } else {
      markInstructionVideoComplete();
    }

    const advanceInstruction = (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!instructionVideoComplete || instructionAdvanced) return;
      instructionAdvanced = true;
      document.removeEventListener('keydown', handleSpacebar, true);
      if (instructionContinueBtn) {
        instructionContinueBtn.removeEventListener('click', advanceInstruction);
      }
      console.log(`📋 Instructions completed for ${experimentType}`);
      this.nextStage();
    };

    // Handle spacebar to continue (matching legacy)
    const handleSpacebar = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        // Use capture + preventDefault so space doesn't play/pause any instruction videos
        advanceInstruction(event);
      }
    };

    // Capture phase ensures we intercept before focused elements (like <video>) handle spacebar.
    document.addEventListener('keydown', handleSpacebar, true);
    if (instructionContinueBtn) {
      instructionContinueBtn.addEventListener('click', advanceInstruction);
    }
    document.body.focus();
  }

  /**
   * Comprehension check before Game 3 (2P2G):
   * "Which dot are you? Press on your dot to continue."
   *
   * - Clicking the red dot (correct) continues into Game 3 as normal.
   * - Clicking the purple dot skips remaining stages and jumps to the post-survey questionnaire.
   */
  showComprehensionCheckStage(experimentType, experimentIndex) {
    const renderComprehensionCheck = (showError = false) => {
      this.container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 700px; text-align: center;">
            ${showError ? `
              <h2 style="color:rgb(0, 0, 0); margin-bottom: 20px; font-size: 32px;">Remember you are the red dot, try again!</h2>
            ` : `
              <h2 style="color: #333; margin-bottom: 20px; font-size: 32px;">Which dot are you?</h2>
              <p style="font-size: 20px; color: #555; margin-bottom: 30px;">
                Press on your dot to continue.
              </p>
            `}

            <div style="display: flex; justify-content: center; gap: 80px; margin-bottom: 30px;">
              <button id="red-dot-btn" style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 4px solid #cc0000;
                background: #ff0000;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              ">
              </button>

              <button id="orange-dot-btn" style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 4px solid #6600cc;
                background: #8000ff;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              ">
              </button>
            </div>

          </div>
        </div>
      `;

      // --- Audio: read the question aloud when this page loads ---
      // Use fixed custom recordings only (no TTS fallback).
      let currentAudio = null;

      const stopQuestionAudio = () => {
        try {
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
          }
        } catch (_) {
          // ignore
        }
      };

      const playQuestionAudio = () => {
        if (showError) {
          // For error message, use tryAgain.mp3 from /public
          try {
            const audio = new Audio(this.assetUrl('tryAgain.mp3'));
            currentAudio = audio;
            audio.play().catch((err) => {
              console.warn('Unable to autoplay tryAgain audio:', err);
            });
          } catch (err) {
            console.warn('Error starting tryAgain audio:', err);
          }
        } else {
          try {
            // Use comprehensionCheck.mp3 from /public
            const audio = new Audio(this.assetUrl('comprehensionCheck.mp3'));
            currentAudio = audio;
            audio.play().catch((err) => {
              console.warn('Unable to autoplay comprehension audio:', err);
            });
          } catch (err) {
            console.warn('Error starting comprehension audio:', err);
          }
        }
      };

      // Try immediately – by this point the participant has usually interacted with the page already
      playQuestionAudio();

      const redBtn = document.getElementById('red-dot-btn');
      const orangeBtn = document.getElementById('orange-dot-btn');

      if (redBtn) {
        redBtn.addEventListener('click', () => {
          stopQuestionAudio();
          // Correct answer – proceed to the next timeline stage (Game 3 waiting/match/trials)
          console.log('✅ Comprehension check passed (red dot selected). Continuing to Game 3.');
          this.nextStage();
        });
      }

      if (orangeBtn) {
        orangeBtn.addEventListener('click', () => {
          stopQuestionAudio();
          // Incorrect answer – show error message and re-render
          console.log('⚠️ Comprehension check failed (purple dot selected). Showing error message.');
          renderComprehensionCheck(true);
        });
      }
    };

    // Initial render
    renderComprehensionCheck(false);
  }

  checkPartnerPresenceAndProceed(experimentType, experimentIndex) {
    console.log(`🔍 Checking partner presence for ${experimentType} transition...`);

    // Check if we're in human-human mode and if partner is still connected
    const isP2Human = (CONFIG?.game?.players?.player2?.type === 'human');

    if (isP2Human) {
      // Check if we have network connection and partner
      this.emit('check-partner-status', { experimentType, experimentIndex });

      // Set up a flag to track if we should proceed or skip
      this.partnerStatusChecked = false;
      this.shouldSkipMatchPlay = false;

      // Give a longer timeout to check partner status
      setTimeout(() => {
        if (!this.partnerStatusChecked) {
          console.log('⏰ Partner status check timeout - assuming partner disconnected');
          this.shouldSkipMatchPlay = true;
          this.partnerStatusChecked = true;
        }

        // If we're still in human-human mode after the check, proceed to match-play
        const stillHuman = (CONFIG?.game?.players?.player2?.type === 'human');
        if (stillHuman && !this.shouldSkipMatchPlay) {
          console.log('✅ Partner still connected, proceeding to match-play stage');
          this.nextStage();
        } else {
          console.log('🤖 Partner disconnected, switching to AI mode');
          this.gameMode = 'human-ai';
          // Skip the match-play stage since we're now in AI mode
          this.nextStage(); // This will skip the match-play stage
        }
      }, 3000); // 3 second timeout to allow partner status check
    } else {
      // Already in AI mode, skip match-play stage
      console.log('🤖 Already in AI mode, skipping match-play stage');
      this.gameMode = 'human-ai';
      this.nextStage(); // This will skip the match-play stage
    }
  }

  showWaitingForPartnerStage(experimentType, experimentIndex) {
    // Configurable min/max wait windows (fallback to legacy single value)
    const minWaitMs = (CONFIG?.game?.timing?.waitingForPartnerMinDuration)
      || (CONFIG?.game?.timing?.waitingForPartnerDuration) || 5000;
    const maxWaitMs = (CONFIG?.game?.timing?.waitingForPartnerMaxDuration) || 15000;
    const readyAt = Date.now() + minWaitMs;
    let partnerFound = false;

    // Record waiting start time
    const waitingStartTime = Date.now();
    console.log('⏱️ [WAITING] Partner search started at:', new Date(waitingStartTime).toISOString());
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div id="waiting-room" style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 30px;">Finding another player ...</h2>

          <div style="margin-bottom: 30px;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          </div>

          <p style="font-size: 18px; color: #666; margin-bottom: 20px;">Connecting you with another player...</p>

          <p style="font-size: 14px; color: #999; margin-bottom: 15px;">
            This may take a few moments.
          </p>


        </div>
      </div>

      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    // If player2 is NOT human, only wait for the minimum duration, then proceed
    const isP2Human = (CONFIG?.game?.players?.player2?.type === 'human');
    if (!isP2Human) {
      this.gameMode = 'human-ai';
      setTimeout(() => {
        // Ensure we still reflect a non-human partner; keep current type (ai or gpt)
        this.nextStage();
      }, Math.max(0, readyAt - Date.now()));
      return;
    }

    // HUMAN-HUMAN FLOW BELOW
    // Add spacebar skip option for testing (only allowed after minimum wait window)
    const handleSkipWaiting = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        if (Date.now() < readyAt) return; // enforce minimum wait

        // Record waiting end time and duration for skip
        const waitingEndTime = Date.now();
        const waitingDuration = waitingEndTime - waitingStartTime;
        console.log('⏱️ [WAITING] Skipped after waiting duration:', waitingDuration + 'ms (' + (waitingDuration / 1000).toFixed(1) + 's)');

        // Store waiting time data for export
        this.recordWaitingTime(waitingStartTime, waitingEndTime, waitingDuration, 'skip', experimentType, experimentIndex);

        document.removeEventListener('keydown', handleSkipWaiting);
        console.log('⏭️ Skipping multiplayer waiting after min wait - continuing with AI partner');
        const fallbackType = (CONFIG?.multiplayer?.fallbackAIType) || 'rl_joint';
        GameConfigUtils.setPlayerType(2, fallbackType);
        try { this.emit('fallback-to-ai', { reason: 'waiting-skip', stage: 'waiting-for-partner', at: Date.now(), fallbackAIType: fallbackType }); } catch (_) { /* noop */ }
        this.nextStage();
      }
    };
    document.addEventListener('keydown', handleSkipWaiting);

    // Attempt real partner connection for human-human
    this.emit('waiting-for-partner', { experimentType, experimentIndex });

    // Optional cancel button behavior
    const cancelBtn = document.getElementById('cancel-wait-btn');
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        console.log('⚠️ Waiting canceled by user');
        window.close();
      };
    }

    // When partner connects, advance to the match stage after minimum wait
    const partnerConnectedHandler = (payload) => {
      console.log('👥 Partner connected - will advance after minimum waiting time', payload);
      this.gameMode = 'human-human';
      partnerFound = true;

      // Record waiting end time and duration
      const waitingEndTime = Date.now();
      const waitingDuration = waitingEndTime - waitingStartTime;
      console.log('⏱️ [WAITING] Partner found! Waiting duration:', waitingDuration + 'ms (' + (waitingDuration / 1000).toFixed(1) + 's)');

      // Store waiting time data for export
      this.recordWaitingTime(waitingStartTime, waitingEndTime, waitingDuration, 'partner_found', experimentType, experimentIndex);

      document.removeEventListener('keydown', handleSkipWaiting);
      this.off('partner-connected', partnerConnectedHandler);
      let targetAt = readyAt;
      if (payload && payload.connectedAt) {
        const serverTarget = payload.connectedAt + minWaitMs;
        targetAt = Math.max(targetAt, serverTarget);
      }
      const delay = Math.max(0, targetAt - Date.now());
      setTimeout(() => this.nextStage(), delay);
    };

    // Ensure single handler for this stage
    this.eventHandlers.delete('partner-connected');
    this.on('partner-connected', partnerConnectedHandler);

    // Fallback after maximum wait if no partner connected
    setTimeout(() => {
      if (!partnerFound) {
        // Record waiting end time and duration for timeout
        const waitingEndTime = Date.now();
        const waitingDuration = waitingEndTime - waitingStartTime;
        console.log('⏱️ [WAITING] Timeout after waiting duration:', waitingDuration + 'ms (' + (waitingDuration / 1000).toFixed(1) + 's)');

        // Store waiting time data for export
        this.recordWaitingTime(waitingStartTime, waitingEndTime, waitingDuration, 'timeout', experimentType, experimentIndex);

        console.log(`⌛ No partner found after ${maxWaitMs}ms - falling back to AI mode`);
        const fallbackType = (CONFIG?.multiplayer?.fallbackAIType) || 'rl_joint';
        GameConfigUtils.setPlayerType(2, fallbackType);
        this.gameMode = 'human-ai';
        document.removeEventListener('keydown', handleSkipWaiting);
        // Notify app to record this fallback event
        try { this.emit('fallback-to-ai', { reason: 'waiting-timeout', stage: 'waiting-for-partner', at: Date.now(), fallbackAIType: fallbackType }); } catch (_) { /* noop */ }
        // Notify ExperimentManager to activate AI fallback
        try { if (!CONFIG?.debug?.disableConsoleLogs) console.log(`[DEBUG] Timeline emitting ai-fallback-activated event (waiting timeout)`); } catch (_) {}
        this.emit('ai-fallback-activated', { fallbackType, aiPlayerNumber: 2 });
        this.nextStage();
      }
    }, maxWaitMs);
  }

  showReadyToPlayStage(experimentType, experimentIndex) {
    const humanHuman = this.isHumanHumanMode() && CONFIG.game.players.player2.type === 'human';

    if (humanHuman) {
      // Human-human: Ready button flow
      this.container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Partner Found</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 15px;">Click ready when you're prepared to start.</p>
            <button id="ready-btn" style="background: #28a745; color: white; border: none; padding: 12px 30px; border-radius: 5px; font-size: 16px; cursor: pointer;">
              Ready to Play
            </button>
            <p style="margin-top: 15px; font-size: 12px; color: #666;">Waiting for both players to be ready...</p>
          </div>
        </div>
        <style>
          #ready-btn:hover { background: #218838 !important; }
        </style>
      `;

      const readyBtn = document.getElementById('ready-btn');
      if (readyBtn) {
        readyBtn.onclick = () => {
          readyBtn.disabled = true;
          readyBtn.textContent = 'Waiting for partner...';
          readyBtn.style.background = '#6c757d';
          this.emit('player-ready');
        };
      }

      const allPlayersReadyHandler = () => {
        console.log('🎮 All players ready - proceed to match play gate');
        this.off('all-players-ready', allPlayersReadyHandler);
        this.nextStage();
      };

      // Ensure single handler for this stage
      this.eventHandlers.delete('all-players-ready');
      this.on('all-players-ready', allPlayersReadyHandler);
    } else {
      // Human-AI: Immediately proceed to the match play gate screen
      this.nextStage();
    }
  }

  showMatchPlayStage(experimentType, experimentIndex) {
    // Unified match play gate (Game is Ready!); requires BOTH players to press SPACE to proceed
    const currentStage = this.stages[this.currentStageIndex] || {};
    const showPartnerMsg = currentStage.showPartnerFoundMessage !== false; // default true unless explicitly false
    const partnerMsgHtml = showPartnerMsg
      ? `<p><strong>${this.isHumanHumanMode() ? 'Another player found!' : 'Another player found and connection established!'}</strong></p>`
      : '';

    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="max-width: 600px; margin: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 40px; text-align: center;">
          <h1 style="color: #28a745; margin-bottom: 30px;">✅ Game is Ready!</h1>
          <div style="margin: 20px 0; text-align: center;">
            <video
              id="matchPlayVideo"
              width="100%"
              height="400"
              controls
              autoplay
              playsinline
              style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <source src="${this.assetUrl('video3.mp4')}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          <div style="font-size: 20px; color: #333; margin-bottom: 20px;">
            ${partnerMsgHtml}
            <p style="margin-top: 10px; font-size: 20px;">
              You are ${this.playerIndex === 0 ? 'Player 1 (Red)' : 'Player 2 (Orange)'}
              <span style="display:inline-block; width: 14px; height: 14px; background-color: ${this.playerIndex === 0 ? CONFIG.visual.colors.player1 : CONFIG.visual.colors.player2}; border-radius: 50%; vertical-align: middle; margin-left: 6px;"></span>
            </p>
            <div id="matchStartPanel" style="display: none; margin: 24px auto 0; max-width: 480px; background: #f8fbff; border: 2px solid #28a745; border-radius: 12px; padding: 18px 22px; text-align: center;">
              <p style="margin: 0 0 14px; font-size: 24px; font-weight: 700; color: #333;">Press the spacebar or click here to start the game!</p>
              <button id="matchStartBtn" type="button" disabled style="background: #28a745; color: white; border: none; padding: 14px 42px; font-size: 22px; font-weight: bold; border-radius: 8px; cursor: not-allowed; opacity: 0.55; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.2s, opacity 0.2s;">
                Start Game
              </button>
              <p style="font-size: 14px; margin: 14px 0 0;">${this.isHumanHumanMode() ? 'Both players must be ready to begin.' : ''}</p>
              <div id="match-status" style="font-size: 14px; color: #666; display: none; margin-top: 8px;">Waiting for the other player to be ready...</div>
            </div>

          </div>
        </div>
      </div>
    `;

    const matchVideo = document.getElementById('matchPlayVideo');
    const matchStartPanel = document.getElementById('matchStartPanel');
    const matchStartBtn = document.getElementById('matchStartBtn');
    let matchVideoComplete = false;
    let matchPlayStarted = false;

    const showMatchStartControls = () => {
      matchVideoComplete = true;
      if (matchStartPanel) {
        matchStartPanel.style.display = 'block';
      }
      if (matchStartBtn) {
        matchStartBtn.disabled = false;
        matchStartBtn.style.cursor = 'pointer';
        matchStartBtn.style.opacity = '1';
      }
    };

    if (matchVideo) {
      matchVideo.addEventListener('ended', showMatchStartControls, { once: true });
      matchVideo.addEventListener('error', showMatchStartControls, { once: true });
      if (matchVideo.ended) {
        showMatchStartControls();
      }
    } else {
      showMatchStartControls();
    }

    const startMatchPlay = (event) => {
      const isSpaceEvent = event?.type === 'keydown' && (event.code === 'Space' || event.key === ' ');
      if (event?.type === 'keydown' && !isSpaceEvent) {
        return;
      }

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!matchVideoComplete || matchPlayStarted) {
        return;
      }

      matchPlayStarted = true;
      document.removeEventListener('keydown', startMatchPlay, true);
      if (matchStartBtn) {
        matchStartBtn.removeEventListener('click', startMatchPlay);
        matchStartBtn.disabled = true;
        matchStartBtn.textContent = this.isHumanHumanMode() ? 'Waiting...' : 'Starting...';
        matchStartBtn.style.cursor = 'default';
        matchStartBtn.style.opacity = '0.75';
      }

        // Signal match-play readiness
        this.emit('match-play-ready');

        // In human-human mode, wait for server game-started (mapped to all-players-ready)
        // In human-AI mode, proceed immediately
        if (this.isHumanHumanMode() && CONFIG.game.players.player2.type === 'human') {
          const status = document.getElementById('match-status');
          if (status) status.style.display = 'block';

          // Start a timeout to fall back to AI if the other player
          // does not press SPACE within the configured threshold
          const readyTimeoutMs = (CONFIG?.multiplayer?.matchPlayReadyTimeout ?? 10000);
          let timeoutId = null;
          const fallbackToAI = () => {
            try {
              console.log(`⌛ Match-play wait exceeded (${readyTimeoutMs}ms) - falling back to AI mode`);
              const fallbackType = (CONFIG?.multiplayer?.fallbackAIType) || 'rl_joint';
            try { if (!CONFIG?.debug?.disableConsoleLogs) console.log(`[DEBUG] Timeline fallback - fallbackType: ${fallbackType}`); } catch (_) {}
              GameConfigUtils.setPlayerType(2, fallbackType);
            try { if (!CONFIG?.debug?.disableConsoleLogs) console.log(`[DEBUG] Timeline fallback - After setPlayerType, Player2: ${CONFIG.game.players.player2.type}`); } catch (_) {}
              this.gameMode = 'human-ai';
              // Clean up listener to avoid double-proceed if server emits later
              this.off('all-players-ready', allReadyHandler);

              // Notify ExperimentManager to activate AI fallback
            try { if (!CONFIG?.debug?.disableConsoleLogs) console.log(`[DEBUG] Timeline emitting ai-fallback-activated event`); } catch (_) {}
              this.emit('ai-fallback-activated', { fallbackType, aiPlayerNumber: 2 });
            } catch (_) { /* noop */ }
            this.nextStage();
          };

          const allReadyHandler = () => {
            this.off('all-players-ready', allReadyHandler);
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            this.nextStage();
          };
          // Ensure single listener
          this.eventHandlers.delete('all-players-ready');
          this.on('all-players-ready', allReadyHandler);

          // Arm the timeout after we start listening for readiness
          timeoutId = setTimeout(() => {
            const fallbackType = (CONFIG?.multiplayer?.fallbackAIType) || 'rl_joint';
            try { this.emit('fallback-to-ai', { reason: 'match-play-timeout', stage: 'match-play', at: Date.now(), fallbackAIType: fallbackType }); } catch (_) { /* noop */ }
            fallbackToAI();
          }, readyTimeoutMs);
        } else {
          this.nextStage();
        }
    };
    // Capture phase so space doesn't play/pause the video element.
    document.addEventListener('keydown', startMatchPlay, true);
    if (matchStartBtn) {
      matchStartBtn.addEventListener('click', startMatchPlay);
    }
    document.body.focus();
  }

  showFixationStage(experimentType, experimentIndex, trialIndex) {
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="text-align: center;">
          <div id="fixation-canvas-container"></div>
          <div style="margin-top: 20px; font-size: 14px; color: #666;">
          </div>
        </div>
      </div>
    `;

    // Emit event to show fixation display
    this.emit('show-fixation', { experimentType, experimentIndex, trialIndex });

    // Add spacebar skip option for testing
    const handleSkip = (event) => {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        document.removeEventListener('keydown', handleSkip);
        console.log('⏭️ Fixation skipped by user');
        this.nextStage();
      }
    };
    document.addEventListener('keydown', handleSkip);

    // Auto-advance after fixation duration
    console.log(`⏰ Setting fixation timeout for ${CONFIG.game.timing.fixationDuration}ms`);
    const timeoutId = setTimeout(() => {
      document.removeEventListener('keydown', handleSkip);
      console.log(`⚡ Fixation completed for trial ${trialIndex} - advancing to next stage`);
      this.nextStage();
    }, CONFIG.game.timing.fixationDuration);

    // Store timeout ID for potential cleanup
    this.currentFixationTimeout = timeoutId;
  }

  runTrialStage(experimentType, experimentIndex, trialIndex) {
    console.log(`🎮 Starting trial ${trialIndex} of ${experimentType}`);

    // Determine legend based on actual player index whenever it's a 2P experiment
    // This stays consistent even if mode switches to human-AI mid-session
    let playerColor = CONFIG.visual.colors.player1; // Default red
    let playerName = 'Player 1 (Red)';
    if (experimentType.includes('2P')) {
      playerColor = this.playerIndex === 0 ? CONFIG.visual.colors.player1 : CONFIG.visual.colors.player2;
      playerName = this.playerIndex === 0 ? 'Player 1 (Red)' : 'Player 2 (Orange)';
    }
    const totalRounds = GameConfigUtils.getNumTrials(experimentType);
    const totalGames = CONFIG?.game?.experiments?.order?.length || 1;

    // Create trial container with game canvas area
    this.container.innerHTML = `
      <div
        data-grid-fit-container="true"
        data-grid-reserved-height="125"
        style="box-sizing: border-box; display: flex; align-items: flex-start; justify-content: center; min-height: 100vh; background: #f8f9fa; padding: 10px 16px 48px; overflow: hidden;"
      >
        <div style="text-align: center; max-width: 800px; width: 100%; display: flex; flex-direction: column; align-items: center;">
          <h3 id="game-title" style="margin: 4px 0 10px; font-size: 18px; line-height: 1.2;">Game ${experimentIndex + 1}/${totalGames}: Round ${trialIndex + 1}/${totalRounds}</h3>
          <div id="game-canvas-container" style="margin: 0 auto; position: relative; display: flex; justify-content: center; width: 100%; max-width: 100%;">
            <!-- Game canvas will be inserted here by ExperimentManager -->
          </div>
          <div style="margin-top: 8px; font-size: 14px; color: #666; line-height: 1.3;">
            <p style="margin: 0;">You are ${playerName} <span style="display: inline-block; width: 18px; height: 18px; background-color: ${playerColor}; border-radius: 50%; vertical-align: middle;"></span>. Use arrow keys to move.</p>
          </div>
        </div>
      </div>
    `;

    // Emit event to start trial
    this.emit('start-trial', {
      experimentType,
      experimentIndex,
      trialIndex,
      onComplete: (result) => {
        // Store trial result
        if (!this.experimentData.experiments[experimentType]) {
          this.experimentData.experiments[experimentType] = [];
        }
        this.experimentData.experiments[experimentType].push(result);

        // Update success threshold tracking for collaboration experiments
        if (experimentType.includes('2P') && CONFIG.game.successThreshold.enabled) {
          this.updateSuccessThresholdTracking(result.success, trialIndex);
        }

        console.log(`✅ Trial ${trialIndex} completed`);
        this.nextStage();
      }
    });
  }

  showPostTrialStage(experimentType, experimentIndex, trialIndex) {
    // Get the last trial result
    const trialResult = this.experimentData.experiments[experimentType]?.[trialIndex];
    const success = trialResult?.success || false;
    const totalRounds = GameConfigUtils.getNumTrials(experimentType);
    const totalGames = CONFIG?.game?.experiments?.order?.length || 1;

    // Instead of creating a new page, show feedback as overlay on the current game canvas
    // Find the existing game canvas container
    const gameCanvasContainer = document.getElementById('game-canvas-container');

    if (gameCanvasContainer) {
      // Show feedback overlay on the existing game canvas
      this.emit('show-trial-feedback', {
        success,
        experimentType,
        trialIndex,
        canvasContainer: gameCanvasContainer
      });
    } else {
      // Fallback: create a new container if game canvas not found
      this.container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="text-align: center; max-width: 600px; width: 100%;">
            <h3 style="margin-bottom: 10px;">Game ${experimentIndex + 1}/${totalGames}</h3>
            <h4 style="margin-bottom: 20px;">Round ${trialIndex + 1}/${totalRounds} Results</h4>
            <div id="feedbackCanvasContainer" style="margin: 0 auto 20px auto; position: relative; display: flex; justify-content: center;"></div>
          </div>
        </div>
      `;

      this.emit('show-trial-feedback', {
        success,
        experimentType,
        trialIndex,
        canvasContainer: document.getElementById('feedbackCanvasContainer')
      });
    }

    // Auto-advance after feedback duration
    setTimeout(() => {
      console.log(`📊 Post-trial feedback completed for trial ${trialIndex}`);

      // Check if we should continue to next trial or end the experiment
      if (experimentType.includes('2P') && CONFIG.game.successThreshold.enabled) {
        // Dynamic trial progression for collaboration experiments
        if (this.shouldContinueToNextTrial(experimentType, trialIndex)) {
          console.log(`Continuing to next trial for ${experimentType}`);
          // Add the next trial stages dynamically
          this.addNextTrialStages(experimentType, experimentIndex, trialIndex + 1);
          this.nextStage();
        } else {
          console.log(`Ending ${experimentType} experiment`);
          // Skip to next experiment or completion stage
          this.skipToNextExperimentOrCompletion(experimentType);
        }
      } else {
        // Normal progression for non-collaboration experiments
        this.nextStage();
      }
    }, CONFIG.game.timing.feedbackDisplayDuration);
  }

  showGameFeedbackStage() {
    // Build legacy-compatible metrics based on collected trial results
    const allResults = Object.values(this.experimentData.experiments).flat();
    const trials = allResults.map(r => r?.trialData || r).filter(Boolean);

    const totalTrials = trials.length;

    // Total time in minutes between first trial start and last trial end
    let totalTimeMinutes = 0;
    if (trials.length > 0) {
      const firstStart = Math.min(...trials.map(t => Number(t.trialStartTime || 0) || 0));
      const lastEnd = Math.max(...trials.map(t => Number(t.endTime || t.trialEndTime || 0) || 0));
      const totalMs = Math.max(0, lastEnd - firstStart);
      totalTimeMinutes = Math.round(totalMs / (1000 * 60));
    }

    const hasCollaborationTrials = trials.some(t => String(t.experimentType || '').includes('2P'));
    const hasSinglePlayerTrials = trials.some(t => String(t.experimentType || '').includes('1P'));

    // Single-player success: t.completed === true
    let singlePlayerSuccessRate = 0;
    if (hasSinglePlayerTrials) {
      const sp = trials.filter(t => String(t.experimentType || '').includes('1P'));
      const spSuccess = sp.filter(t => t.completed === true).length;
      singlePlayerSuccessRate = sp.length > 0 ? Math.round((spSuccess / sp.length) * 100) : 0;
    }

    // Collaboration success: t.collaborationSucceeded === true
    let collaborationSuccessRate = 0;
    if (hasCollaborationTrials) {
      const cp = trials.filter(t => String(t.experimentType || '').includes('2P'));
      const cpSuccess = cp.filter(t => t.collaborationSucceeded === true).length;
      collaborationSuccessRate = cp.length > 0 ? Math.round((cpSuccess / cp.length) * 100) : 0;
    }

    // Render legacy UI and content
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 700px; width: 100%; text-align: center;">
          <h2 style="color: #333; margin-bottom: 30px;">🎮 Game Performance Summary</h2>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
            <h3 style="color: #666; margin-bottom: 20px;">Your Results</h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
                <h4 style="color: #007bff; margin-bottom: 10px; font-size: 18px;">📊 Total Trials</h4>
                <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${totalTrials}</p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <h4 style="color: #28a745; margin-bottom: 10px; font-size: 18px;">⏱️ Total Time</h4>
                <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${totalTimeMinutes} min</p>
              </div>

              ${hasSinglePlayerTrials ? `
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                  <h4 style="color: #ffc107; margin-bottom: 10px; font-size: 18px;">🎯 Single Player Success</h4>
                  <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${singlePlayerSuccessRate}%</p>
                  <p style=\"font-size: 14px; color: #666; margin: 5px 0 0 0;\">(${trials.filter(t => String(t.experimentType || '').includes('1P')).length} single player trials)</p>
                </div>
              ` : ''}

              ${hasCollaborationTrials ? `
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
                  <h4 style="color: #dc3545; margin-bottom: 10px; font-size: 18px;">🤝 Collaboration Success</h4>
                  <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${collaborationSuccessRate}%</p>
                  <p style=\"font-size: 14px; color: #666; margin: 5px 0 0 0;\">(${trials.filter(t => String(t.experimentType || '').includes('2P')).length} collaboration trials)</p>
                </div>
              ` : ''}
            </div>
          </div>

          <div style="background: #e8f5e8; border: 2px solid #28a745; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #28a745; margin-bottom: 15px;">📝 Almost Done!</h3>
            <p style="font-size: 18px; color: #333; margin-bottom: 15px;">
              Thank you for completing the game trials!
            </p>
            <p style="font-size: 16px; color: #666; margin-bottom: 0;">
              To finish the experiment, we kindly ask you to fill out a short questionnaire about your experience.
              This will help us understand your thoughts and improve our research.
            </p>
          </div>

          <div style="text-align: center;">
            <button id="continueToQuestionnaireBtn" style="
              background: #28a745;
              color: white;
              border: none;
              padding: 15px 30px;
              font-size: 18px;
              border-radius: 8px;
              cursor: pointer;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              transition: all 0.3s ease;
            " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
              📋 Continue to Questionnaire
            </button>
          </div>
        </div>
      </div>
    `;

    // Ensure questionnaire stage exists (legacy-compatible safeguard)
    const hasQuestionnaireStage = this.stages.some(s => s.type === 'questionnaire');
    if (!hasQuestionnaireStage) {
      this.stages.push({ type: 'questionnaire', handler: () => this.showQuestionnaireStage() });
    }

    // Proceed on button click
    const btn = document.getElementById('continueToQuestionnaireBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        console.log('🎮 Game Feedback Stage: Continue button clicked');
        this.nextStage();
      });
    }
  }

  showQuestionnaireStage() {
    const startQuestionnaire = () => {
      // Keyboard-first questionnaire (mouse/touch also supported for the first question)
      const questions = [
        {
          name: 'ai_detection',
          title: 'Page 1 of 3',
          prompt: 'Do you think the other player is a person or a computer?',
          options: ['Person', 'Computer'],
          optionImages: ['person.png', 'computer.png']
        },
        {
          name: 'collaboration_rating',
          title: 'Page 2 of 3',
          prompt: 'How well did the other player collaborate with you?',
          options: ['Good collaborator', 'Bad collaborator'],
          optionImages: ['good.png', 'bad.png']
        },
        {
          name: 'play_again',
          title: 'Page 3 of 3',
          prompt: 'Would you like to play this game again in the future?',
          options: ['Yes', 'No'],
          optionImages: ['yes.png', 'no.png']
        }
      ];

      const answers = {};
      let qIndex = 0;
      // For the first question (ai_detection), we have 2 options (0/1).
      // Default to index 0 so pressing Space before clicking is safe.
      let selIndex = 0;

      // Questionnaire audio: only question1.mp3–question3.mp3 for each page prompt (no TTS for options).
      let currentAudio = null;
      const synth = window.speechSynthesis || null;

      const playPromptAudio = async (interrupt = true) => {
        const qNum = qIndex + 1;
        const audioPath = this.assetUrl(`question${qNum}.mp3`);

        if (interrupt) {
          if (synth) synth.cancel();
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
          }
        }

        return new Promise((resolve) => {
          const audio = new Audio(audioPath);
          audio.onloadeddata = () => {
            currentAudio = audio;
            audio.play()
              .then(() => {
                audio.onended = () => {
                  currentAudio = null;
                  resolve();
                };
                audio.onerror = () => {
                  currentAudio = null;
                  console.warn('Questionnaire prompt audio playback failed:', audioPath);
                  resolve();
                };
              })
              .catch(() => resolve());
          };
          audio.onerror = () => {
            console.warn('Questionnaire prompt audio missing or failed to load:', audioPath);
            resolve();
          };
          audio.load();
        });
      };

      const renderQuestion = (shouldSpeakPrompt = false) => {
        const q = questions[qIndex];
        const images = q.optionImages || [];

        const optionsHtml = q.options.map((opt, idx) => {
          const isSelected = idx === selIndex;
          const borderColor = isSelected ? '#4f46e5' : '#e5e7eb';
          const bgColor = isSelected ? '#eef2ff' : '#ffffff';
          const src = images[idx] ? this.assetUrl(images[idx]) : '';
          return `
            <button type="button" class="image-option" data-idx="${idx}" aria-label="${opt.replace(/"/g, '&quot;')}" style="
              padding: 12px 16px;
              margin: 8px 12px;
              border-radius: 16px;
              border: 3px solid ${borderColor};
              background: ${bgColor};
              cursor: pointer;
              display: inline-flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            ">
              ${src
                ? `<img src="${src}" alt="" style="max-width: min(200px, 38vw); max-height: 180px; height: auto; display: block; object-fit: contain;" />`
                : `<span style="font-size: 18px; color: #333;">${opt}</span>`}
            </button>`;
        }).join('');

        this.container.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f8f9fa; padding:20px;">
            <div style="background:white; padding:32px; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.1); width:100%; max-width:720px;">
              <div style="text-align:center; margin-bottom:12px; color:#6b7280; font-weight:600;">📋 Post-Game Questionnaire</div>
              <div style="text-align:center; margin-bottom:8px; color:#6b7280; font-weight:600;">${q.title}</div>
              <h2 style="text-align:center; margin:8px 0 20px; color:#111827;">${q.prompt}</h2>
              <div style="margin-bottom:16px; text-align:center; color:#6b7280;">
                Click an image to answer (or use arrow keys and Space).
              </div>
              <div id="options" style="display:flex; flex-direction:row; flex-wrap:wrap; justify-content:center; align-items:center;">${optionsHtml}</div>
            </div>
          </div>`;

        if (shouldSpeakPrompt) {
          playPromptAudio(true);
        }

        const buttons = this.container.querySelectorAll('.image-option');
        buttons.forEach((btn) => {
          btn.addEventListener('click', () => {
            const idx = Number(btn.getAttribute('data-idx') || '0');
            selIndex = idx;
            answers[q.name] = q.options[selIndex];

            if (synth) synth.cancel();
            if (currentAudio) {
              currentAudio.pause();
              currentAudio.currentTime = 0;
              currentAudio = null;
            }

            if (qIndex < questions.length - 1) {
              qIndex += 1;
              selIndex = 0;
              renderQuestion(true);
            } else {
              document.removeEventListener('keydown', handleKeys);
              this.experimentData.questionnaire = answers;
              this.experimentData.questionnaireCompletedAt = new Date().toISOString();
              console.log('📝 Questionnaire completed');
              this.nextStage();
            }
          });
        });
      };

      const handleKeys = (e) => {
        const isPreviousKey =
          e.code === 'ArrowUp' || e.key === 'ArrowUp' ||
          e.code === 'ArrowLeft' || e.key === 'ArrowLeft';
        const isNextKey =
          e.code === 'ArrowDown' || e.key === 'ArrowDown' ||
          e.code === 'ArrowRight' || e.key === 'ArrowRight';

        if (isPreviousKey) {
          e.preventDefault();
          selIndex = Math.max(0, selIndex - 1);
          renderQuestion(false);
        } else if (isNextKey) {
          e.preventDefault();
          selIndex = Math.min(questions[qIndex].options.length - 1, selIndex + 1);
          renderQuestion(false);
        } else if (e.code === 'Space' || e.key === ' ') {
          e.preventDefault();

          if (synth) synth.cancel();
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
          }

          answers[questions[qIndex].name] = questions[qIndex].options[selIndex];

          if (qIndex < questions.length - 1) {
            qIndex += 1;
            selIndex = 0;
            renderQuestion(true);
          } else {
            document.removeEventListener('keydown', handleKeys);
            if (synth) synth.cancel();
            if (currentAudio) {
              currentAudio.pause();
              currentAudio.currentTime = 0;
              currentAudio = null;
            }
            this.experimentData.questionnaire = answers;
            this.experimentData.questionnaireCompletedAt = new Date().toISOString();
            console.log('📝 Questionnaire completed');
            this.nextStage();
          }
        }
      };

      renderQuestion(true); // Initial render
      document.addEventListener('keydown', handleKeys);

      // Clean up speech when leaving the page
      const cleanup = () => {
        if (synth) synth.cancel();
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          currentAudio = null;
        }
        document.removeEventListener('keydown', handleKeys);
      };

      // Store cleanup function for potential future use
      this._questionnaireCleanup = cleanup;
    };

    // Questionnaire instructions video BEFORE the questions
    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 30px; font-size: 32px;">Questionnaire</h2>

          <div style="margin: 20px 0; text-align: center;">
            <video
              id="questionnaireInstructionsVideo"
              width="100%"
              height="400"
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              style="max-width: 600px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <source src="${this.assetUrl('questionnaire-instructions.mp4')}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>

          <div id="questionnaireStartPanel" style="display: none; margin: 24px auto 0; max-width: 520px; background: #f8fbff; border: 2px solid #28a745; border-radius: 12px; padding: 18px 22px; text-align: center;">
            <p style="font-size: 22px; color: #333; font-weight: 700; margin: 0 0 14px;">
              When you are ready, press the spacebar or click here to start the questions.
            </p>
            <button id="questionnaireStartBtn" type="button" disabled style="background: #28a745; color: white; border: none; padding: 14px 42px; font-size: 22px; font-weight: bold; border-radius: 8px; cursor: not-allowed; opacity: 0.55; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.2s, opacity 0.2s;">
              Start Questions
            </button>
          </div>
        </div>
      </div>
    `;

    // Autoplay behavior: first try with sound, fall back to muted
    const videoEl = document.getElementById('questionnaireInstructionsVideo');
    const questionnaireStartPanel = document.getElementById('questionnaireStartPanel');
    const questionnaireStartBtn = document.getElementById('questionnaireStartBtn');
    let questionnaireVideoComplete = false;

    const showQuestionnaireStartControls = () => {
      questionnaireVideoComplete = true;
      if (questionnaireStartPanel) {
        questionnaireStartPanel.style.display = 'block';
      }
      if (questionnaireStartBtn) {
        questionnaireStartBtn.disabled = false;
        questionnaireStartBtn.style.cursor = 'pointer';
        questionnaireStartBtn.style.opacity = '1';
      }
    };

    if (videoEl) {
      videoEl.addEventListener('ended', showQuestionnaireStartControls, { once: true });
      videoEl.addEventListener('error', showQuestionnaireStartControls, { once: true });
      if (videoEl.ended) {
        showQuestionnaireStartControls();
      }

      videoEl.autoplay = true;
      videoEl.playsInline = true;

      const tryPlayWithSound = () => {
        videoEl.muted = false;
        videoEl.volume = 1;
        return videoEl.play();
      };

      tryPlayWithSound().catch((err) => {
        console.warn('Unable to autoplay questionnaire video with sound, falling back to muted:', err);

        videoEl.muted = true;
        videoEl.play().catch((err2) => {
          console.warn('Unable to autoplay muted questionnaire video:', err2);
        });

        const enableSoundOnFirstInteraction = () => {
          try {
            videoEl.muted = false;
            videoEl.volume = 1;
            videoEl.play().catch((err3) => {
              console.warn('Unable to start questionnaire video with sound after interaction:', err3);
            });
          } catch (_) { /* noop */ }
          document.removeEventListener('click', enableSoundOnFirstInteraction);
          document.removeEventListener('keydown', enableSoundOnFirstInteraction);
          videoEl.removeEventListener('click', enableSoundOnFirstInteraction);
        };

        document.addEventListener('click', enableSoundOnFirstInteraction, { once: true });
        document.addEventListener('keydown', enableSoundOnFirstInteraction, { once: true });
        videoEl.addEventListener('click', enableSoundOnFirstInteraction, { once: true });
      });
    } else {
      showQuestionnaireStartControls();
    }

    // Spacebar or click to start the questions
    let questionnaireStarted = false;
    const startQuestionnaireFromInput = (event) => {
      const isSpaceEvent = event?.type === 'keydown' && (event.code === 'Space' || event.key === ' ');
      if (event?.type === 'keydown' && !isSpaceEvent) {
        return;
      }

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!questionnaireVideoComplete || questionnaireStarted) return;
      questionnaireStarted = true;
      document.removeEventListener('keydown', startQuestionnaireFromInput, true);
      if (questionnaireStartBtn) {
        questionnaireStartBtn.removeEventListener('click', startQuestionnaireFromInput);
        questionnaireStartBtn.disabled = true;
        questionnaireStartBtn.textContent = 'Starting...';
        questionnaireStartBtn.style.cursor = 'default';
        questionnaireStartBtn.style.opacity = '0.75';
      }
      startQuestionnaire();
    };
    document.addEventListener('keydown', startQuestionnaireFromInput, true);
    if (questionnaireStartBtn) {
      questionnaireStartBtn.addEventListener('click', startQuestionnaireFromInput);
    }
    document.body.focus();
  }

  showEndExperimentInfoStage() {
    const completionCode = this.generateCompletionCode();
    const notifyLookitDone = () => {
      if (this._lookitDonePosted) return;
      this._lookitDonePosted = true;
      try {
        window.parent.postMessage({ type: 'exp-lookit:next' }, '*');
      } catch (err) {
        console.warn('Unable to post exp-lookit:next message:', err);
      }
    };

    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
          <h2 style="color: #222; margin-bottom: 30px;">Experiment Complete</h2>

          <p style="font-size: 18px; margin-bottom: 20px;">
            Thank you for participating in our study!
          </p>

          <!--
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffeeba; color: #856404;">
            We are saving your data now. Your completion code will be shown after your data has been saved successfully.
          </div>
          -->

          <div style="margin-bottom: 8px;">
            <div id="saving-status" style="display: inline-block; margin: 10px; color: #555; font-size: 16px; line-height: 1.5;">Saving your data...</div>
          </div>
        </div>
      </div>
    `;

    // Save data (emit event for external handler)
    this.experimentData.completed = true;
    this.experimentData.completionCode = completionCode;
    this.experimentData.endTime = new Date().toISOString();
    this.experimentData.dataSaveCheckpointTimes = {
      ...(this.experimentData.dataSaveCheckpointTimes || {}),
      questionnaire_complete: this.experimentData.endTime
    };

    this.emit('save-data', {
      ...this.experimentData,
      saveCheckpoint: 'questionnaire_complete',
      saveCheckpointTime: this.experimentData.endTime
    });

    // Safety: If save takes too long or fails silently, still direct participants to the platform Next button.
    try {
      if (CONFIG?.server?.enableGoogleDriveSave) {
        setTimeout(() => {
          const el = document.getElementById('saving-status');
          if (el && !this._lookitDonePosted) {
            el.textContent = 'Save taking longer than expected. Please click Next at the bottom right to continue.';
            el.style.color = '#555';
            notifyLookitDone();
          }
        }, 15000);
      }
    } catch (_) { /* noop */ }

    // Update UI when data save succeeds.
    const handleSaved = () => {
      const el = document.getElementById('saving-status');
      if (el) {
        el.innerHTML = 'Data saved successfully. Please click <strong style="color: #28a745;">Next</strong> at the bottom right of the screen.';
        el.style.color = '#333';
      }
      this.off('data-save-success', handleSaved);
      notifyLookitDone();
    };
    // Ensure single listener
    this.eventHandlers.delete('data-save-success');
    this.on('data-save-success', handleSaved);
  }

  showProlificRedirectStage() {
    const code = (CONFIG?.game?.prolificCompletionCode) || this.experimentData.completionCode || 'CTNDR8GV';

    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">🎉 Experiment Complete!</h2>
          <p style="font-size: 16px; margin-bottom: 12px;">Thank you for completing the experiment!</p>
          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Please copy the code below and submit it in Prolific.</p>

          <div style="background: #e8f5e8; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-bottom: 10px;">Your Completion Code</h3>
            <div style="background: white; border: 2px dashed #28a745; border-radius: 5px; padding: 15px; margin: 10px 0;">
              <p id="completionCodeText" style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0; font-family: monospace; letter-spacing: 2px;">${code}</p>
            </div>
            <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">Copy this code now to complete your submission in Prolific.</p>
            <div style="margin-top: 12px;">
              <button id="copyCodeBtn" style="background: #007bff; color: white; border: none; padding: 10px 16px; font-size: 14px; border-radius: 5px; cursor: pointer;">Copy Code</button>
              <span id="copyStatus" style="margin-left: 10px; font-size: 14px; color: #28a745; display: none;">Copied!</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Wire up Copy button with clipboard API (with fallback)
    try {
      const copyBtn = document.getElementById('copyCodeBtn');
      const codeEl = document.getElementById('completionCodeText');
      const statusEl = document.getElementById('copyStatus');
      if (copyBtn && codeEl) {
        copyBtn.addEventListener('click', async () => {
          const text = (codeEl.textContent || '').trim();
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(text);
            } else {
              const tmp = document.createElement('textarea');
              tmp.value = text;
              document.body.appendChild(tmp);
              tmp.select();
              document.execCommand('copy');
              document.body.removeChild(tmp);
            }
            if (statusEl) {
              statusEl.style.display = 'inline';
              copyBtn.textContent = 'Copied!';
              copyBtn.style.background = '#28a745';
              setTimeout(() => {
                statusEl.style.display = 'none';
                copyBtn.textContent = 'Copy Code';
                copyBtn.style.background = '#007bff';
              }, 2000);
            }
          } catch (e) {
            console.warn('Copy failed:', e);
          }
        });
      }
    } catch (_) { /* noop */ }
  }

  /**
   * Helper methods
   */

  isHumanHumanMode() {
    // Prefer explicit runtime state, then config, then URL param
    if (this.gameMode === 'human-human') return true;

    if (GameConfigUtils && typeof GameConfigUtils.isHumanHumanMode === 'function') {
      if (GameConfigUtils.isHumanHumanMode()) return true;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    return mode === 'human-human';
  }

  assetUrl(path) {
    const base = import.meta.env?.BASE_URL || '/';
    const normalizedPath = String(path || '').replace(/^\/+/, '');
    return `${base}${normalizedPath}`;
  }

  getInstructionsForExperiment(experimentType) {
    // Debug cue: joint → red title, individual → blue (see CONFIG.game.studyRLCondition)
    const game1TitleColor =
      CONFIG?.game?.studyRLCondition === 'individual' ? '#2563eb' : '#dc2626';

    const travelerDot = '<span style="display:inline-block;width:20px;height:20px;background:red;border-radius:50%;vertical-align:middle;margin:0 4px;"></span>';
    const restaurantBox = '<span style="display:inline-block;width:20px;height:20px;background:#007bff;border-radius:3px;vertical-align:middle;margin:0 4px;"></span>';
    const renderInstructionList = (items) => `
      <ul style="font-size: 22px; color: #1f2937; margin: 0; line-height: 1.55; text-align: left; padding-left: 24px;">
        ${items.map(item => `<li style="margin-bottom: 10px;">${item}</li>`).join('')}
      </ul>
    `;
    const renderVideoInstruction = ({
      title,
      titleColor = '#333',
      subtitle,
      intro = '',
      items,
      videoId,
      videoSrc
    }) => ({
      html: `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa; padding: 24px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: calc(100% - 24px); max-width: 1120px; text-align: center;">
            <h2 style="color: ${titleColor}; margin: 0 0 12px; font-size: 36px;">${title}</h2>
            <h3 style="color: #000; margin: 0 0 22px; font-size: 24px;">${subtitle}</h3>

            <div style="display: flex; justify-content: center; align-items: stretch; gap: 24px; flex-wrap: wrap;">
              <div style="flex: 1 1 420px; min-width: 300px; background: #f8fbff; border: 2px solid #007bff; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; justify-content: center;">
                ${intro ? `<p style="font-size: 22px; color: #1f2937; margin: 0 0 16px; line-height: 1.55; text-align: left;">${intro}</p>` : ''}
                ${renderInstructionList(items)}
              </div>

              <div style="flex: 1 1 420px; min-width: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <video
                  id="${videoId}"
                  width="100%"
                  height="360"
                  controls
                  autoplay
                  playsinline
                  style="display: block; width: 100%; height: auto; max-height: 420px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background: #000;">
                  <source src="${this.assetUrl(videoSrc)}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
                <div id="instructionContinuePanel" style="display: none; box-sizing: border-box; width: 100%; margin-top: 14px; background: #f8fbff; border: 2px solid #007bff; border-radius: 12px; padding: 16px 18px; text-align: center;">
                  <p style="font-size: 18px; color: #1f2937; font-weight: bold; line-height: 1.35; margin: 0 0 14px;">
                    Press the spacebar or click here to continue!
                  </p>
                  <button id="instructionContinueBtn" type="button" disabled style="background: #28a745; color: white; border: none; padding: 14px 42px; font-size: 20px; font-weight: bold; border-radius: 8px; cursor: not-allowed; opacity: 0.55; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.2s, opacity 0.2s;">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    });

    const instructions = {
      '1P1G': renderVideoInstruction({
        title: 'Game 1',
        titleColor: game1TitleColor,
        subtitle: "Before we begin, let's practice a few rounds!",
        videoId: 'game1Video',
        videoSrc: 'game1.mp4',
        items: [
          `You are the traveler ${travelerDot}.`,
          `There is one restaurant ${restaurantBox} on the map.`,
          'Use the arrow keys to reach the restaurant.'
        ]
      }),
      '1P2G': renderVideoInstruction({
        title: 'Game 2',
        subtitle: 'Great job!',
        videoId: 'game2Video',
        videoSrc: 'game2.mp4',
        intro: 'Now there will be several identical restaurants on the map.',
        items: [
          'Each round, you can win by getting to one of the restaurants.',
          'Some restaurants are open when the round starts. Others may appear later.'
        ]
      }),
      '2P2G': renderVideoInstruction({
        title: 'Game 3',
        subtitle: 'Well done!',
        videoId: 'game3Video',
        videoSrc: 'game3.mp4',
        intro: 'In this game, you will work with a teammate.',
        items: [
          'Each round, you win if both players go to the same restaurant.',
          'You lose the round if you end up at different restaurants.',
          'Both players move one step at a time after both players choose a direction.'
        ]
      }),
      '2P3G': renderVideoInstruction({
        title: 'Game 4',
        subtitle: 'Good job!',
        videoId: 'game4Video',
        videoSrc: 'video2.mp4',
        intro: 'Now you will work with the same teammate again.',
        items: [
          'Each round, you win if both players go to the same restaurant.',
          'You lose the round if you end up at different restaurants.',
          'Some restaurants are open when the round starts. Others may appear later.'
        ]
      })
    };

    return instructions[experimentType] || {
      html: `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8f9fa;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 30px;">Game Instructions</h2>
            <p style="font-size: 18px; margin-bottom: 30px;">Use arrow keys to navigate and reach the goals.</p>
            <p style="font-size: 20px; margin-top: 30px;">Press <strong>space bar</strong> to begin.</p>
          </div>
        </div>
      `
    };
  }

  generateParticipantId() {
    return 'P' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  parseDob(dob) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dob || '').trim());
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
    if (year < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return null;

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return { year, month, day, date };
  }

  calculateAgeFromDob(dob, referenceDate = new Date()) {
    const parsed = this.parseDob(dob);
    if (!parsed) return null;

    const ref = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate()
    );
    const birth = parsed.date;
    if (birth > ref) return null;

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const birthUtc = Date.UTC(parsed.year, parsed.month - 1, parsed.day);
    const refUtc = Date.UTC(ref.getFullYear(), ref.getMonth(), ref.getDate());
    const totalDays = Math.floor((refUtc - birthUtc) / 86400000);

    return {
      participantDob: `${String(parsed.year).padStart(4, '0')}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`,
      participantAgeReferenceDate: `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}-${String(ref.getDate()).padStart(2, '0')}`,
      participantAgeYears: years,
      participantAgeMonths: months,
      participantAgeDays: days,
      participantAgeTotalDays: totalDays
    };
  }

  getUrlParam(names) {
    try {
      const params = new URLSearchParams(window.location.search);
      for (const name of names) {
        const value = params.get(name);
        if (value) return value;
      }
    } catch (e) {
      // ignore
    }
    return '';
  }

  getBooleanUrlParam(names) {
    const value = this.getUrlParam(names).toLowerCase();
    return ['1', 'true', 'yes', 'y'].includes(value);
  }

  shouldSkipDobInput() {
    return this.getBooleanUrlParam([
      'skipDob',
      'skipDOB',
      'skipDateOfBirth',
      'skip_dob'
    ]);
  }

  getLookitResponseId() {
    return this.getUrlParam([
      'response',
      'responseId',
      'lookit_response',
      'lookitResponseId',
      'LOOKIT_RESPONSE_ID'
    ]);
  }

  getLookitChildId() {
    return this.getUrlParam([
      'child',
      'childId',
      'lookit_child',
      'lookitChildId',
      'LOOKIT_CHILD_ID'
    ]);
  }

  getParticipantId() {
    const explicitParticipantId = this.getUrlParam([
      'PROLIFIC_PID',
      'prolific_pid',
      'participantId',
      'participant_id'
    ]);
    if (explicitParticipantId) return explicitParticipantId;

    const lookitResponseId = this.getLookitResponseId();
    if (lookitResponseId) return lookitResponseId;

    return this.generateParticipantId();
  }

  generateCompletionCode() {
    return (CONFIG?.game?.prolificCompletionCode) || 'CTNDR8GV';
  }

  /**
   * Initialize success threshold tracking for a new experiment
   */
  initializeSuccessThresholdTracking() {
    this.successThreshold.consecutiveSuccesses = 0;
    this.successThreshold.totalTrialsCompleted = 0;
    this.successThreshold.experimentEndedEarly = false;
    this.successThreshold.lastSuccessTrial = -1;
    this.successThreshold.successHistory = [];
  }

  /**
   * Update success threshold tracking after a trial
   */
  updateSuccessThresholdTracking(success, trialIndex) {
    this.successThreshold.totalTrialsCompleted++;
    this.successThreshold.successHistory.push(success);

    if (success) {
      this.successThreshold.consecutiveSuccesses++;
      this.successThreshold.lastSuccessTrial = trialIndex;
    } else {
      this.successThreshold.consecutiveSuccesses = 0;
    }

    console.log(`Success threshold update - Trial ${trialIndex + 1}: ${success ? 'SUCCESS' : 'FAILURE'}`);
    console.log(`  Consecutive successes: ${this.successThreshold.consecutiveSuccesses}/${CONFIG.game.successThreshold.consecutiveSuccessesRequired}`);
    console.log(`  Total trials: ${this.successThreshold.totalTrialsCompleted}/${CONFIG.game.successThreshold.maxTrials}`);
  }

  /**
   * Check if experiment should end due to success threshold
   */
  shouldEndExperimentDueToSuccessThreshold() {
    if (!CONFIG.game.successThreshold.enabled) {
      return false;
    }

    const config = CONFIG.game.successThreshold;
    const tracking = this.successThreshold;

    // Check if we've reached the maximum trials
    if (tracking.totalTrialsCompleted >= config.maxTrials) {
      console.log(`Experiment ending: Reached maximum trials (${config.maxTrials})`);
      return true;
    }

    // Check if we have enough trials and consecutive successes
    if (tracking.totalTrialsCompleted >= config.minTrialsBeforeCheck &&
        tracking.consecutiveSuccesses >= config.consecutiveSuccessesRequired) {
      console.log(`Experiment ending: Success threshold met (${tracking.consecutiveSuccesses} consecutive successes after ${tracking.totalTrialsCompleted} trials)`);
      this.successThreshold.experimentEndedEarly = true;
      return true;
    }

    return false;
  }

  /**
   * Check if we should continue to next trial
   */
  shouldContinueToNextTrial(experimentType, trialIndex) {
    // Only apply to collaboration games
    if (!experimentType.includes('2P')) {
      return trialIndex < GameConfigUtils.getNumTrials(experimentType) - 1;
    }

    // Check if experiment should end due to success threshold
    if (this.shouldEndExperimentDueToSuccessThreshold()) {
      console.log(`Ending ${experimentType} experiment due to success threshold`);
      return false;
    }

    // Check if we've reached the configured number of trials for this specific experiment
    const maxTrials = GameConfigUtils.getNumTrials(experimentType) || CONFIG.game.successThreshold.maxTrials;
    if (trialIndex >= maxTrials - 1) {
      console.log(`Ending ${experimentType} experiment: Completed ${maxTrials} trials`);
      return false;
    }

    return true;
  }

  /**
   * Add next trial stages dynamically (similar to legacy addNextTrialStages)
   */
  addNextTrialStages(experimentType, experimentIndex, trialIndex) {
    // Find the current post-trial stage index
    const currentStageIndex = this.currentStageIndex;

    // Insert the next trial stages after the current post-trial stage
    const stagesToInsert = [
      {
        type: 'fixation',
        experimentType: experimentType,
        experimentIndex: experimentIndex,
        trialIndex: trialIndex,
        handler: () => this.showFixationStage(experimentType, experimentIndex, trialIndex)
      },
      {
        type: 'trial',
        experimentType: experimentType,
        experimentIndex: experimentIndex,
        trialIndex: trialIndex,
        handler: () => this.runTrialStage(experimentType, experimentIndex, trialIndex)
      },
      {
        type: 'post-trial',
        experimentType: experimentType,
        experimentIndex: experimentIndex,
        trialIndex: trialIndex,
        handler: () => this.showPostTrialStage(experimentType, experimentIndex, trialIndex)
      }
    ];

    // Insert stages after current stage
    this.stages.splice(currentStageIndex + 1, 0, ...stagesToInsert);

    console.log(`Added next trial stages for ${experimentType} trial ${trialIndex + 1}`);
  }

  /**
   * Skip to next experiment or completion stage (similar to legacy)
   */
  skipToNextExperimentOrCompletion(currentExperimentType) {
    console.log(`Skipping to next experiment or completion from ${currentExperimentType}`);

    // Find the next stage that's either a different experiment or completion
    let nextStageIndex = this.currentStageIndex + 1;
    console.log(`Starting search from stage ${nextStageIndex}`);
    console.log(`Total stages in timeline: ${this.stages.length}`);

    while (nextStageIndex < this.stages.length) {
      const nextStage = this.stages[nextStageIndex];
      console.log(`Checking stage ${nextStageIndex}: ${nextStage.type}`);

      // If it's a different experiment type, game-feedback stage, questionnaire stage, or completion stage, stop here
      if (nextStage.type === 'game-feedback' ||
          nextStage.type === 'questionnaire' ||
          nextStage.type === 'completion' ||
          (nextStage.experimentType && nextStage.experimentType !== currentExperimentType)) {
        console.log(`Found stopping point: ${nextStage.type}`);
        break;
      }
      nextStageIndex++;
    }

    // Set the current stage to the found stage
    this.currentStageIndex = nextStageIndex;

    // If we found a valid next stage and it's a different experiment, reset success threshold
    if (this.currentStageIndex < this.stages.length) {
      const nextStage = this.stages[this.currentStageIndex];
      if (nextStage.experimentType && nextStage.experimentType !== currentExperimentType) {
        console.log(`Switching from ${currentExperimentType} to ${nextStage.experimentType} - resetting success threshold`);
        this.initializeSuccessThresholdTracking();
      }
      console.log(`Skipped to stage ${this.currentStageIndex}: ${nextStage.type}`);
      this.runCurrentStage();
    } else {
      console.log('No more stages to run');
    }
  }

  // Record waiting time data for export
  recordWaitingTime(startTime, endTime, duration, reason, experimentType, experimentIndex) {
    const waitingDurationSeconds = Math.round(duration / 1000 * 10) / 10; // Round to 1 decimal place

    // Store in experiment data for Excel export
    if (!this.experimentData.waitingDuration) {
      this.experimentData.waitingDuration = 0;
    }
    this.experimentData.waitingDuration += waitingDurationSeconds;

    // Store detailed waiting info
    if (!this.experimentData.waitingDetails) {
      this.experimentData.waitingDetails = [];
    }
    this.experimentData.waitingDetails.push({
      experimentType: experimentType,
      experimentIndex: experimentIndex,
      durationSeconds: waitingDurationSeconds,
      reason: reason,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString()
    });

    console.log('📊 [WAITING] Recorded waiting time:', waitingDurationSeconds + 's (total: ' + this.experimentData.waitingDuration + 's)');
  }
}
// cache bust Thu Mar 26 15:55:13 EDT 2026
