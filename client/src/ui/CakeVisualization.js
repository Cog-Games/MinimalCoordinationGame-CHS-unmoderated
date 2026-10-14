// Persistent cupcake reward visualization for the Stag Hunt experiment.
// Lives outside the timeline's container (which is rebuilt every trial), so it
// survives across all rounds of a single Stag Hunt run. It sits in a row beneath
// the game grid: red chef's cupcakes | shared cupcakes | purple chef's cupcakes
// (which side red/purple sit on is randomized per participant).

import { CONFIG } from '../config/gameConfig.js';

const WIDGET_GAP = 24;
const WIDGET_HEIGHT = 280;
// The middle (shared) widget is this much wider than the solo cupcake makers
const SHARED_WIDTH_RATIO = 1.5;
// Chef Cowlie stands to the left of the map
const COW_WIDTH = 230;
const COW_CELEBRATE_DURATION = 2400;
// Chef-hat labels sit above the cupcake makers
const LABEL_HEIGHT = 56;
export const WIDGET_ROW_HEIGHT = LABEL_HEIGHT + WIDGET_HEIGHT;
// Placeholder element in the trial screen that reserves space for the widget row
export const WIDGET_ROW_SLOT_ID = 'cake-widget-row-slot';
// Cupcakes added to the shared widget when both chefs reach the big kitchen
const SHARED_BATCH_SIZE = 5;
// The shared widget must fit this many batches (one per Phase 4 map); the
// cupcake size shrinks as needed so they all fit
const SHARED_BATCH_CAPACITY = 16;
// Cupcake sizing (px); every cupcake on screen uses the same size
const MAX_CUPCAKE_SIZE = 28;
const MIN_CUPCAKE_SIZE = 10;
const CUPCAKE_ASPECT = 646 / 478; // height / width of cupcake.png
// Layout metrics, kept in sync with STYLE below
const WIDGET_INSET = 14 + 3; // padding + border, per side
const AREA_GAP = 6;
const BATCH_GAP = 3;
const BATCH_PAD_X = 5;
const BATCH_PAD_Y = 3;

const STYLE_ID = 'cake-visualization-styles';
const STYLE = `
.cupcake-widget .cupcake-batch {
  display: flex;
  gap: ${BATCH_GAP}px;
  padding: ${BATCH_PAD_Y}px ${BATCH_PAD_X}px;
  animation: cake-pop-in 200ms ease-out both;
}
.cupcake-widget .cupcake-batch .cupcake {
  animation: none;
}
@keyframes cake-pop-in {
  from { opacity: 0; transform: translateY(12px) scale(.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.cupcake-widget { height: ${WIDGET_HEIGHT}px; }
.cupcake-label {
  position: fixed;
  z-index: 9999;
  height: ${LABEL_HEIGHT - 6}px;
  width: auto;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
}
.cupcake-label[hidden] { display: none; }
#cake-cow {
  position: fixed;
  z-index: 9999;
  height: auto;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 8px 14px rgba(100, 45, 20, 0.25));
  animation: cow-bounce-in 400ms ease-out both;
}
#cake-cow[hidden] { display: none; }
@keyframes cow-bounce-in {
  0% { opacity: 0; transform: translateY(24px) scale(.85); }
  60% { opacity: 1; transform: translateY(-6px) scale(1.03); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.cupcake-widget {
  box-sizing: border-box;
  position: fixed;
  z-index: 9999;
  padding: ${WIDGET_INSET - 3}px;
  text-align: center;
  font-family: system-ui, sans-serif;
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid #fff;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(100, 45, 20, 0.2);
  pointer-events: none;
  user-select: none;
  display: flex;
}
.cupcake-widget[hidden] { display: none; }
.cupcake-widget.red { border-color: ${CONFIG.visual.colors.player1}; }
.cupcake-widget.purple { border-color: ${CONFIG.visual.colors.player2}; }
.cupcake-widget .cupcake-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  align-items: flex-end;
  justify-content: center;
  gap: ${AREA_GAP}px;
  overflow: hidden;
}
.cupcake-widget .cupcake {
  width: var(--cupcake-size, ${MAX_CUPCAKE_SIZE}px);
  height: auto;
  flex: 0 0 auto;
  filter: drop-shadow(0 2px 3px rgba(100, 45, 20, 0.25));
  animation: cake-pop-in 200ms ease-out both;
}
`;

export class CakeVisualization {
  constructor() {
    this.el = null; // shared (middle) cupcake widget
    this.sharedAreaEl = null;
    this.cowEl = null;
    this.cowHideTimeout = null;
    // Cupcake makers keyed by chef: 'red' (player 1) and 'purple' (player 2)
    this.cupcakeWidgets = {};
    // Randomized once per participant: whether the red chef's cupcake maker sits
    // on the right (and purple on the left) instead of the default red-left
    this.redOnRight = Math.random() < 0.5;
    this.handleResize = null;
    this.currentVoiceAudio = null;
  }

  ensureMounted() {
    if (this.el) return;

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = STYLE;
      document.head.appendChild(style);
    }

    const widget = document.createElement('div');
    widget.id = 'cupcake-widget-shared';
    widget.className = 'cupcake-widget shared';
    widget.hidden = true;
    widget.innerHTML = `<div class="cupcake-area"></div>`;
    document.body.appendChild(widget);

    this.el = widget;
    this.sharedAreaEl = widget.querySelector('.cupcake-area');

    const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
    const assetUrl = (name) => `${base}${name}`.replace(/([^:])\/\//, '$1/');

    this.cowIdleSrc = assetUrl('birthday_Cowlie_framed.png');
    this.cowCelebrateSrc = assetUrl('birthday-cow-celebration.gif');
    this.cupcakeSrc = assetUrl('cupcake.png');
    this.voiceBatchSrc = assetUrl('Yay 5 cupcakes.mp4');
    this.voiceCupcakeSrc = assetUrl('Yay a cupcake.mp4');
    this.voiceNothingSrc = assetUrl('Aw no cupcakes.mp4');

    const cow = document.createElement('img');
    cow.id = 'cake-cow';
    cow.alt = 'Chef cow';
    cow.src = this.cowIdleSrc;
    cow.hidden = true;
    // Re-center once the image's real height is known
    cow.addEventListener('load', () => this.positionWidgets());
    document.body.appendChild(cow);
    this.cowEl = cow;

    for (const chef of ['red', 'purple']) {
      const cupcakeWidget = document.createElement('div');
      cupcakeWidget.id = `cupcake-widget-${chef}`;
      cupcakeWidget.className = `cupcake-widget ${chef}`;
      cupcakeWidget.hidden = true;
      cupcakeWidget.innerHTML = `<div class="cupcake-area"></div>`;
      document.body.appendChild(cupcakeWidget);
      const label = document.createElement('img');
      label.className = 'cupcake-label';
      label.alt = `${chef} chef`;
      label.src = assetUrl(`${chef}_chef_icon.png`);
      label.hidden = true;
      document.body.appendChild(label);

      this.cupcakeWidgets[chef] = {
        el: cupcakeWidget,
        labelEl: label,
        areaEl: cupcakeWidget.querySelector('.cupcake-area')
      };
    }

    this.handleResize = () => this.positionWidgets();
    window.addEventListener('resize', this.handleResize);
  }

  positionWidgets() {
    if (!this.el) return;

    // Lay the row out over the reserved slot under the grid; fall back to just
    // below the canvas if the trial screen didn't provide one.
    const slot = document.getElementById(WIDGET_ROW_SLOT_ID);
    const canvas = document.getElementById('gameCanvas');
    const anchor = slot || canvas;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    if (!rect.width && !rect.height) return;

    const rowTop = (slot ? rect.top : rect.bottom + WIDGET_GAP) + LABEL_HEIGHT;
    const centerX = rect.left + rect.width / 2;
    // Solo cupcake makers match the map's width and the shared one is
    // SHARED_WIDTH_RATIO times wider, all shrinking together only if the row won't fit on screen
    const mapWidth = canvas?.getBoundingClientRect().width || rect.width;
    const availableWidth = window.innerWidth - 4 * WIDGET_GAP;
    const width = Math.max(120, Math.floor(Math.min(mapWidth, availableWidth / (2 + SHARED_WIDTH_RATIO))));
    const sharedWidth = Math.floor(width * SHARED_WIDTH_RATIO);

    const place = (el, left, w = width) => {
      el.style.top = `${rowTop}px`;
      el.style.left = `${Math.max(0, left)}px`;
      el.style.width = `${w}px`;
    };
    const leftSideX = centerX - sharedWidth / 2 - WIDGET_GAP - width;
    const rightSideX = centerX + sharedWidth / 2 + WIDGET_GAP;
    const redLeft = this.redOnRight ? rightSideX : leftSideX;
    const purpleLeft = this.redOnRight ? leftSideX : rightSideX;
    place(this.cupcakeWidgets.red.el, redLeft);
    place(this.el, centerX - sharedWidth / 2, sharedWidth);
    place(this.cupcakeWidgets.purple.el, purpleLeft);

    // One cupcake size for all three widgets, chosen so the shared one fits every batch
    document.documentElement.style.setProperty('--cupcake-size', `${this.fitCupcakeSize(sharedWidth)}px`);

    // Center each chef-hat label just above its cupcake maker
    const placeLabel = (labelEl, left) => {
      const labelWidth = labelEl.offsetWidth || (LABEL_HEIGHT - 6) * (385 / 294);
      labelEl.style.top = `${rowTop - LABEL_HEIGHT}px`;
      labelEl.style.left = `${Math.max(0, left + (width - labelWidth) / 2)}px`;
    };
    placeLabel(this.cupcakeWidgets.red.labelEl, redLeft);
    placeLabel(this.cupcakeWidgets.purple.labelEl, purpleLeft);

    // Cow sits to the left of the map, vertically centered on it, shrinking to fit
    if (canvas) {
      const mapRect = canvas.getBoundingClientRect();
      const cowWidth = Math.max(80, Math.min(COW_WIDTH, mapRect.left - 2 * WIDGET_GAP));
      this.cowEl.style.width = `${cowWidth}px`;
      this.cowEl.style.left = `${Math.max(0, mapRect.left - WIDGET_GAP - cowWidth)}px`;
      const cowHeight = this.cowEl.offsetHeight || cowWidth;
      this.cowEl.style.top = `${Math.max(0, mapRect.top + (mapRect.height - cowHeight) / 2)}px`;
    }
  }

  // Largest cupcake size at which SHARED_BATCH_CAPACITY batches fit in the shared widget
  fitCupcakeSize(sharedWidth) {
    const innerW = sharedWidth - 2 * WIDGET_INSET;
    const innerH = WIDGET_HEIGHT - 2 * WIDGET_INSET;
    for (let size = MAX_CUPCAKE_SIZE; size > MIN_CUPCAKE_SIZE; size--) {
      const batchW = SHARED_BATCH_SIZE * size + (SHARED_BATCH_SIZE - 1) * BATCH_GAP + 2 * BATCH_PAD_X;
      const batchH = size * CUPCAKE_ASPECT + 2 * BATCH_PAD_Y;
      const cols = Math.floor((innerW + AREA_GAP) / (batchW + AREA_GAP));
      const rows = Math.floor((innerH + AREA_GAP) / (batchH + AREA_GAP));
      if (cols * rows >= SHARED_BATCH_CAPACITY) return size;
    }
    return MIN_CUPCAKE_SIZE;
  }

  show() {
    this.ensureMounted();
    this.el.hidden = false;
    Object.values(this.cupcakeWidgets).forEach(({ el, labelEl }) => {
      el.hidden = false;
      labelEl.hidden = false;
    });
    this.cowEl.hidden = false;
    if (!this.cowHideTimeout) this.cowEl.src = this.cowIdleSrc;
    this.positionWidgets();
    // Re-place after the grid's responsive sizing settles for this trial
    requestAnimationFrame(() => this.positionWidgets());
  }

  hide() {
    if (this.el) this.el.hidden = true;
    Object.values(this.cupcakeWidgets).forEach(({ el, labelEl }) => {
      el.hidden = true;
      labelEl.hidden = true;
    });
    if (this.cowEl) this.cowEl.hidden = true;
    if (this.cowHideTimeout) {
      clearTimeout(this.cowHideTimeout);
      this.cowHideTimeout = null;
    }
    if (this.currentVoiceAudio) {
      this.currentVoiceAudio.pause();
      this.currentVoiceAudio.currentTime = 0;
      this.currentVoiceAudio = null;
    }
  }

  // Plays a pre-recorded celebration line, stopping any line already playing.
  playVoiceLine(src) {
    if (!src) return;
    try {
      if (this.currentVoiceAudio) {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      }
      const audio = new Audio(src);
      this.currentVoiceAudio = audio;
      audio.play().catch((err) => console.warn('Unable to autoplay voice line:', err));
    } catch (err) {
      console.warn('Error starting voice line audio:', err);
    }
  }

  celebrateWithCow() {
    this.ensureMounted();
    // Cache-bust so the gif restarts playback from its first frame each time.
    this.cowEl.src = `${this.cowCelebrateSrc}?t=${Date.now()}`;
    this.cowEl.hidden = false;
    this.positionWidgets();

    if (this.cowHideTimeout) clearTimeout(this.cowHideTimeout);
    this.cowHideTimeout = setTimeout(() => {
      this.cowEl.src = this.cowIdleSrc;
      this.cowHideTimeout = null;
    }, COW_CELEBRATE_DURATION);
  }

  reset() {
    this.ensureMounted();
    this.sharedAreaEl.innerHTML = '';
    Object.values(this.cupcakeWidgets).forEach(({ areaEl }) => { areaEl.innerHTML = ''; });
  }

  createCupcakeImg() {
    const cupcake = document.createElement('img');
    cupcake.className = 'cupcake';
    cupcake.alt = 'Cupcake';
    cupcake.src = this.cupcakeSrc;
    return cupcake;
  }

  // Both chefs reached the big kitchen: add a batch of SHARED_BATCH_SIZE
  // cupcakes to the shared widget, grouped so each batch reads as one reward
  addSharedBatch() {
    this.ensureMounted();
    this.playVoiceLine(this.voiceBatchSrc);
    const batch = document.createElement('div');
    batch.className = 'cupcake-batch';
    for (let i = 0; i < SHARED_BATCH_SIZE; i++) batch.appendChild(this.createCupcakeImg());
    this.sharedAreaEl.appendChild(batch);
    this.celebrateWithCow();
  }

  // Add a cupcake to the given chef's cupcake maker ('red' or 'purple')
  addCupcake(chef) {
    this.ensureMounted();
    const widget = this.cupcakeWidgets[chef];
    if (!widget) return;
    widget.areaEl.appendChild(this.createCupcakeImg());
  }

  // Update the widgets from a Stag Hunt trial outcome:
  //  - sharedBatch: both chefs reached the big kitchen together -> add 5 shared cupcakes
  //  - redCupcake / purpleCupcake: that chef reached a small kitchen -> add a cupcake
  // The voice line and cow celebration follow the participant's own outcome (messageType):
  //  'stag-hunt-both-stag' / 'stag-hunt-human-rabbit' / 'stag-hunt-human-nothing'
  applyOutcome({ messageType, sharedBatch, redCupcake, purpleCupcake }) {
    this.ensureMounted();
    if (sharedBatch) this.addSharedBatch();
    if (redCupcake) this.addCupcake('red');
    if (purpleCupcake) this.addCupcake('purple');

    if (messageType === 'stag-hunt-human-rabbit') {
      this.playVoiceLine(this.voiceCupcakeSrc);
      this.celebrateWithCow();
    } else if (messageType === 'stag-hunt-human-nothing') {
      this.playVoiceLine(this.voiceNothingSrc);
    }
    this.positionWidgets();
  }
}
