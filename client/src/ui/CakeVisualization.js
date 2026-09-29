// Persistent "build the cake" reward visualization for the Stag Hunt experiment.
// Lives outside the timeline's container (which is rebuilt every trial), so it
// survives across all rounds of a single Stag Hunt run. It is anchored next to
// the game grid canvas and matches its height.

import { CONFIG } from '../config/gameConfig.js';

// Dedicated art covers layers 1-16 (see LAYER_PHOTOS below); allow a bit of
// headroom past that for the rare case of a near-perfect run, falling back to
// the generic stacked-rectangle rendering beyond MAX_PHOTO_LAYER.
const MAX_LAYERS = 21;
const WIDGET_WIDTH = 240;
const GRID_GAP = 24;
const COW_WIDTH = 230;
const COW_CELEBRATE_DURATION = 2400;

// The "cupcakes become a layer" gif must finish (and settle on the static
// photo) no later than the trial-feedback popup itself disappears, so the
// gif is never still playing once the next round starts.
const LAYER_ANIM_DURATION = CONFIG.game.timing.feedbackDisplayDuration;

// Dedicated art for each layer 1-16: a short "cupcakes become a layer" gif,
// followed by a static photo that stays up until the next layer. Beyond this
// we fall back to the generic stacked-rectangle rendering below.
const MAX_PHOTO_LAYER = 16;
const LAYER_PHOTOS = Object.fromEntries(
  Array.from({ length: MAX_PHOTO_LAYER }, (_, i) => {
    const n = i + 1;
    const padded = String(n).padStart(2, '0');
    return [n, {
      anim: `cake-layer-${padded}-anim.gif`,
      photo: `cake-layer-${padded}.png`,
      duration: LAYER_ANIM_DURATION
    }];
  })
);

const STYLE_ID = 'cake-visualization-styles';
const STYLE = `
#cake-widget {
  box-sizing: border-box;
  position: fixed;
  z-index: 9999;
  width: ${WIDGET_WIDTH}px;
  padding: 14px 14px 10px;
  text-align: center;
  font-family: system-ui, sans-serif;
  color: #4a2418;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #fff;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(100, 45, 20, 0.2);
  pointer-events: none;
  user-select: none;
  display: flex;
}
#cake-widget[hidden] { display: none; }
#cake-widget .cake-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  overflow: hidden;
}
#cake-widget .cake {
  width: 92%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}
#cake-widget .layer {
  position: relative;
  width: var(--layer-width);
  height: 28px;
  flex: 0 0 28px;
  border: 2px solid #e8b879;
  border-radius: 8px 8px 4px 4px;
  background: linear-gradient(#ffe9c8 0 28%, #ffdca7 28% 100%);
  animation: cake-pop-in 200ms ease-out both;
}
#cake-widget .layer::before {
  content: "";
  position: absolute;
  left: -3px;
  right: -3px;
  top: -11px;
  height: 17px;
  border-radius: 50%;
  background: #7f351d;
  border: 2px solid #5d2415;
  z-index: 1;
}
#cake-widget .plate {
  width: 96%;
  height: 16px;
  border-radius: 50%;
  background: #b9dce2;
  border: 3px solid #75adb7;
  box-shadow: 0 5px 0 #75adb7;
}
#cake-widget .cake-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom;
  border-radius: 16px;
  z-index: 2;
  pointer-events: none;
}
#cake-widget .cake-photo[hidden] { display: none; }
@keyframes cake-pop-in {
  from { opacity: 0; transform: translateY(12px) scale(.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
#cake-cow {
  position: fixed;
  z-index: 9999;
  width: ${COW_WIDTH}px;
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
#cupcake-widget {
  box-sizing: border-box;
  position: fixed;
  z-index: 9999;
  width: ${WIDGET_WIDTH}px;
  padding: 14px;
  text-align: center;
  font-family: system-ui, sans-serif;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #fff;
  border-radius: 20px;
  box-shadow: 0 10px 28px rgba(100, 45, 20, 0.2);
  pointer-events: none;
  user-select: none;
  display: flex;
}
#cupcake-widget[hidden] { display: none; }
#cupcake-widget .cupcake-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
}
#cupcake-widget .cupcake {
  width: 30px;
  height: auto;
  flex: 0 0 auto;
  filter: drop-shadow(0 2px 3px rgba(100, 45, 20, 0.25));
  animation: cake-pop-in 200ms ease-out both;
  pointer-events: auto;
  cursor: pointer;
}
`;

export class CakeVisualization {
  constructor() {
    this.el = null;
    this.cakeEl = null;
    this.cowEl = null;
    this.cowHideTimeout = null;
    this.plateEl = null;
    this.cakePhotoEl = null;
    this.cakePhotoTimeout = null;
    this.cupcakeWidgetEl = null;
    this.cupcakeAreaEl = null;
    this.layerCount = 0;
    this.handleResize = null;
    this.currentVoiceAudio = null;

    // Randomize once per participant which side each widget appears on, so
    // the cake tower isn't always on the right / cupcakes always on the left.
    this.layoutFlipped = Math.random() < 0.5;
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
    widget.id = 'cake-widget';
    widget.hidden = true;
    widget.innerHTML = `
      <div class="cake-area">
        <div class="cake"></div>
        <div class="plate"></div>
      </div>
      <img class="cake-photo" alt="" hidden />
    `;
    document.body.appendChild(widget);

    this.el = widget;
    this.cakeEl = widget.querySelector('.cake');
    this.plateEl = widget.querySelector('.plate');
    this.cakePhotoEl = widget.querySelector('.cake-photo');

    const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
    const assetUrl = (name) => `${base}${name}`.replace(/([^:])\/\//, '$1/');

    this.cowIdleSrc = assetUrl('chef_cow.png');
    this.cowCelebrateSrc = assetUrl('cow-celebration.gif');
    this.cupcakeSrc = assetUrl('cupcake.png');
    this.voiceLayerSrc = assetUrl('Yay another layer of cupcakes.mp4');
    this.voiceCupcakeSrc = assetUrl('Yay another cupcake.mp4');
    this.voiceNothingSrc = assetUrl('Aw no cupcakes.mp4');
    this.voiceOneCupcakeSrc = assetUrl('1 cupcake.mp4');
    this.layerPhotos = Object.fromEntries(
      Object.entries(LAYER_PHOTOS).map(([count, { anim, photo, duration }]) => [
        count,
        { anim: assetUrl(anim), photo: assetUrl(photo), duration }
      ])
    );

    const cow = document.createElement('img');
    cow.id = 'cake-cow';
    cow.alt = 'Chef cow';
    cow.src = this.cowIdleSrc;
    cow.hidden = true;
    document.body.appendChild(cow);
    this.cowEl = cow;

    const cupcakeWidget = document.createElement('div');
    cupcakeWidget.id = 'cupcake-widget';
    cupcakeWidget.hidden = true;
    cupcakeWidget.innerHTML = `<div class="cupcake-area"></div>`;
    document.body.appendChild(cupcakeWidget);
    this.cupcakeWidgetEl = cupcakeWidget;
    this.cupcakeAreaEl = cupcakeWidget.querySelector('.cupcake-area');

    this.handleResize = () => this.positionWidgets();
    window.addEventListener('resize', this.handleResize);
  }

  positionWidgets() {
    if (!this.el) return;
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width && !rect.height) return;

    const widgetTop = Math.max(0, rect.top);
    const leftSideX = Math.max(0, rect.left - GRID_GAP - WIDGET_WIDTH);
    const rightSideX = rect.right + GRID_GAP;

    // Which side each widget sits on is randomized once per participant
    // (see this.layoutFlipped) so the cake tower/cupcakes aren't always on
    // the same side of the grid.
    const cakeX = this.layoutFlipped ? leftSideX : rightSideX;
    const cupcakeX = this.layoutFlipped ? rightSideX : leftSideX;

    this.el.style.top = `${widgetTop}px`;
    this.el.style.left = `${cakeX}px`;
    this.el.style.height = `${rect.height}px`;

    this.cupcakeWidgetEl.style.top = `${widgetTop}px`;
    this.cupcakeWidgetEl.style.left = `${cupcakeX}px`;
    this.cupcakeWidgetEl.style.height = `${rect.height}px`;

    // Cow sits centered beneath the grid canvas.
    this.cowEl.style.left = `${Math.max(0, rect.left + (rect.width - COW_WIDTH) / 2)}px`;
    this.cowEl.style.top = `${rect.bottom + GRID_GAP}px`;
  }

  show() {
    this.ensureMounted();
    this.el.hidden = false;
    this.cowEl.hidden = false;
    this.cowEl.src = this.cowIdleSrc;
    this.cupcakeWidgetEl.hidden = false;
    this.positionWidgets();
  }

  hide() {
    if (this.el) this.el.hidden = true;
    if (this.cowEl) this.cowEl.hidden = true;
    if (this.cupcakeWidgetEl) this.cupcakeWidgetEl.hidden = true;
    if (this.cowHideTimeout) {
      clearTimeout(this.cowHideTimeout);
      this.cowHideTimeout = null;
    }
    if (this.cakePhotoTimeout) {
      clearTimeout(this.cakePhotoTimeout);
      this.cakePhotoTimeout = null;
    }
    if (this.cakePhotoEl) this.cakePhotoEl.hidden = true;
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
    this.positionWidgets();

    // Cache-bust so the gif restarts playback from its first frame each time.
    this.cowEl.src = `${this.cowCelebrateSrc}?t=${Date.now()}`;
    this.cowEl.hidden = false;

    if (this.cowHideTimeout) clearTimeout(this.cowHideTimeout);
    this.cowHideTimeout = setTimeout(() => {
      this.cowEl.src = this.cowIdleSrc;
      this.cowHideTimeout = null;
    }, COW_CELEBRATE_DURATION);
  }

  reset() {
    this.ensureMounted();
    this.layerCount = 0;
    this.cakeEl.innerHTML = '';
    this.cupcakeAreaEl.innerHTML = '';
    if (this.cakePhotoTimeout) {
      clearTimeout(this.cakePhotoTimeout);
      this.cakePhotoTimeout = null;
    }
    if (this.cakePhotoEl) this.cakePhotoEl.hidden = true;
    if (this.plateEl) this.plateEl.hidden = false;
  }

  // Plays a layer-transition animation once, then calls onComplete.
  playLayerAnimation(animSrc, duration, onComplete) {
    if (!this.cakePhotoEl) {
      onComplete();
      return;
    }

    // Cache-bust so the gif restarts playback from its first frame each time.
    this.cakePhotoEl.src = `${animSrc}?t=${Date.now()}`;
    this.cakePhotoEl.hidden = false;
    this.plateEl.hidden = true;

    if (this.cakePhotoTimeout) clearTimeout(this.cakePhotoTimeout);
    this.cakePhotoTimeout = setTimeout(() => {
      this.cakePhotoTimeout = null;
      onComplete();
    }, duration);
  }

  // Settle on a dedicated cake photo once the intro animation finishes. This
  // stays on screen as-is until the next layer is added (see addLayer()).
  showLayerPhoto(photoSrc) {
    this.cakeEl.innerHTML = '';
    this.plateEl.hidden = true;
    this.cakePhotoEl.src = photoSrc;
    this.cakePhotoEl.hidden = false;
  }

  // Rebuild the generic stacked-layer cake for layerCount layers (used once we
  // outgrow the dedicated layer photos, since there's no custom art beyond them).
  renderGenericLayersFromScratch() {
    this.cakeEl.innerHTML = '';
    for (let i = 0; i < this.layerCount; i++) {
      const layer = document.createElement('div');
      layer.className = 'layer';
      const width = Math.max(48, 94 - i * 3);
      layer.style.setProperty('--layer-width', `${width}%`);
      this.cakeEl.appendChild(layer);
    }
  }

  appendGenericLayer() {
    const layer = document.createElement('div');
    layer.className = 'layer';
    const width = Math.max(48, 94 - (this.layerCount - 1) * 3);
    layer.style.setProperty('--layer-width', `${width}%`);
    this.cakeEl.appendChild(layer);
  }

  addLayer() {
    this.ensureMounted();
    if (this.layerCount >= MAX_LAYERS) return;

    this.playVoiceLine(this.voiceLayerSrc);

    this.layerCount += 1;
    const newLayerCount = this.layerCount;
    const photoConfig = this.layerPhotos[newLayerCount];

    if (photoConfig) {
      // Celebrate immediately (same as every other round) so it's visible
      // during this round's feedback window, then play the transition
      // animation and settle on the matching cake photo.
      this.celebrateWithCow();
      this.playLayerAnimation(photoConfig.anim, photoConfig.duration, () => this.showLayerPhoto(photoConfig.photo));
      return;
    }

    if (newLayerCount === MAX_PHOTO_LAYER + 1) {
      // First layer past our dedicated art: switch from the last photo to the
      // generic stacked-rectangle cake, rebuilding every layer at once.
      this.cakePhotoEl.hidden = true;
      this.plateEl.hidden = false;
      this.renderGenericLayersFromScratch();
    } else {
      this.appendGenericLayer();
    }
    this.celebrateWithCow();
  }

  addCupcake() {
    this.ensureMounted();
    this.playVoiceLine(this.voiceCupcakeSrc);
    const cupcake = document.createElement('img');
    cupcake.className = 'cupcake';
    cupcake.alt = 'Cupcake';
    cupcake.src = this.cupcakeSrc;
    cupcake.addEventListener('mouseenter', () => this.playVoiceLine(this.voiceOneCupcakeSrc));
    this.cupcakeAreaEl.appendChild(cupcake);
  }

  // Update the cake from a Stag Hunt trial-feedback message type:
  //  - 'stag-hunt-both-stag'   -> collaboration succeeded, add a cake layer
  //  - 'stag-hunt-human-rabbit'-> solo/small reward taken, add a cupcake
  //  - 'stag-hunt-human-nothing' -> mismatch, nothing added
  applyOutcome(messageType) {
    this.ensureMounted();
    if (messageType === 'stag-hunt-both-stag') {
      this.addLayer();
    } else if (messageType === 'stag-hunt-human-rabbit') {
      this.addCupcake();
    } else if (messageType === 'stag-hunt-human-nothing') {
      this.playVoiceLine(this.voiceNothingSrc);
    }
    this.positionWidgets();
  }
}
