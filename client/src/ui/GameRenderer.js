import { CONFIG, GAME_OBJECTS, GameConfigUtils } from '../config/gameConfig.js';

const assetBase = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || '/';
const assetUrl = (name) => `${assetBase}${name}`.replace(/([^:])\/\//, '$1/');

// Player sprites, shared across renderer instances (tightly cropped chef hats)
const PLAYER_SPRITES = {
  [GAME_OBJECTS.player]: { src: assetUrl('red_chef_icon.png'), image: null },
  [GAME_OBJECTS.ai_player]: { src: assetUrl('purple_chef_icon.png'), image: null }
};
const spriteListeners = new Set();

if (typeof Image !== 'undefined') {
  for (const sprite of Object.values(PLAYER_SPRITES)) {
    const img = new Image();
    img.onload = () => {
      sprite.image = img;
      spriteListeners.forEach((fn) => fn());
    };
    img.src = sprite.src;
  }
}

export class GameRenderer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.cellSize = CONFIG.visual.cellSize;
    this.canvasSize = CONFIG.visual.canvasSize;
    this.padding = CONFIG.visual.padding;
    this.effectiveCellSize = this.cellSize + this.padding; // Cell + padding as used in legacy

    // Redraw once player sprites finish loading
    spriteListeners.add(() => {
      if (this.canvas && this.gameState) this.render(this.canvas, this.gameState);
    });
  }

  // Draw a player's chef sprite centered at (centerX, centerY), falling back to a dot
  drawPlayerSprite(type, centerX, centerY, size) {
    const sprite = PLAYER_SPRITES[type]?.image;
    if (sprite) {
      const scale = size / Math.max(sprite.width, sprite.height);
      const w = sprite.width * scale;
      const h = sprite.height * scale;
      this.ctx.drawImage(sprite, centerX - w / 2, centerY - h / 2, w, h);
      return;
    }
    this.ctx.fillStyle = type === GAME_OBJECTS.player ?
      CONFIG.visual.colors.player1 : CONFIG.visual.colors.player2;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    // Initial dimensions will be set responsively
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
    this.canvas.style.border = '2px solid #333';
    this.canvas.style.backgroundColor = CONFIG.visual.colors.background;

    this.ctx = this.canvas.getContext('2d');

    // Apply responsive sizing on creation
    try { this.applyResponsiveSizing(); } catch (_) { /* ignore until attached */ }

    return this.canvas;
  }

  // Resize canvas and cell metrics to fit viewport/container while staying square
  applyResponsiveSizing() {
    if (!this.canvas) return;

    const gridSize = this.getGridSize();
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) ? window.devicePixelRatio : 1;

    // Determine maximum CSS size available (square) based on viewport and parent container
    const parent = this.canvas.parentElement;
    const fitContainer = this.canvas.closest?.('[data-grid-fit-container="true"]');
    const viewportWidth = (typeof window !== 'undefined') ? (window.innerWidth || 0) : this.canvasSize;
    const viewportHeight = (typeof window !== 'undefined')
      ? Math.floor(window.visualViewport?.height || window.innerHeight || 0)
      : this.canvasSize;
    const viewportMin = Math.min(viewportWidth, viewportHeight);
    const parentWidth = fitContainer?.clientWidth || parent?.clientWidth || viewportMin;
    const reservedHeight = fitContainer
      ? Number(fitContainer.getAttribute('data-grid-reserved-height') || 170)
      : 0;
    const heightLimit = reservedHeight > 0
      ? Math.max(220, viewportHeight - reservedHeight)
      : viewportMin * 0.85;

    const configuredMaxSize = Number(CONFIG.visual.canvasSize) || this.canvasSize;
    const widthLimit = Math.min(parentWidth - 16, viewportWidth - 32);

    // Keep the grid square while reserving room for title, round info, player label,
    // and host-platform controls such as Lookit's bottom-right Next button.
    const targetCssSize = Math.max(
      200,
      Math.floor(Math.min(heightLimit, widthLimit, configuredMaxSize))
    );

    // Compute integer cellSize based on padding formula:
    // total = N*cellSize + (N+1)*padding  => cellSize = (total - (N+1)*padding)/N
    let proposedCellSize = Math.floor((targetCssSize - (gridSize + 1) * this.padding) / gridSize);
    proposedCellSize = Math.max(10, proposedCellSize); // enforce a minimum cell size

    // Recompute the exact canvas size that matches integer cellSize
    const exactCanvasSize = gridSize * proposedCellSize + (gridSize + 1) * this.padding;

    // Update renderer metrics
    this.cellSize = proposedCellSize;
    this.effectiveCellSize = this.cellSize + this.padding;
    this.canvasSize = exactCanvasSize;

    // Set CSS size for layout
    this.canvas.style.width = `${exactCanvasSize}px`;
    this.canvas.style.height = `${exactCanvasSize}px`;

    // Set backing store size for crisp rendering on high-DPI displays
    const backing = Math.floor(exactCanvasSize * dpr);
    if (this.canvas.width !== backing || this.canvas.height !== backing) {
      this.canvas.width = backing;
      this.canvas.height = backing;
    }

    // Ensure context exists and scale to match CSS pixels
    if (!this.ctx) this.ctx = this.canvas.getContext('2d');
    if (this.ctx && typeof this.ctx.setTransform === 'function') {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  getGridSize(gridMatrix = null) {
    const matrix = gridMatrix || this.gameState?.gridMatrix;
    if (Array.isArray(matrix) && matrix.length > 0) {
      return matrix.length;
    }
    return CONFIG.game.matrixSize;
  }

  render(canvas, gameState) {
    if (!canvas || !gameState || !gameState.gridMatrix) {
      return;
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gameState = gameState; // Save game state for player position access

    // Ensure sizing is up-to-date before drawing
    this.applyResponsiveSizing();

    // Draw background with padding (legacy style)
    this.ctx.fillStyle = CONFIG.visual.colors.grid; // Use grid color for background lines
    this.ctx.fillRect(0 - this.padding, 0 - this.padding,
                     this.canvasSize + this.padding, this.canvasSize + this.padding);

    // Draw game grid cells
    this.drawGrid();

    // Draw game objects
    this.drawGameObjects(gameState.gridMatrix);
    this.drawPracticeGuidance();
  }

  drawPracticeGuidance() {
    const state = this.gameState, cue = state?.practiceGuidance;
    if (!cue || !GameConfigUtils.getStagHuntScriptedRound(state.experimentType, state.trialIndex)) return;
    const [r,c] = cue.target, player = state[`player${cue.player}`];
    if (player?.[0] === r && player?.[1] === c) return;
    const size = this.cellSize, x = c*this.effectiveCellSize+this.padding, y = r*this.effectiveCellSize+this.padding;
    const ctx = this.ctx;
    ctx.save();
    // Highlight the destination; the arrow marks the oven, not a prescribed route.
    ctx.strokeStyle = '#e49a00'; ctx.lineWidth = Math.max(2,size*.045);
    ctx.strokeRect(x+size*.04,y+size*.04,size*.92,size*.92);
    ctx.beginPath();
    for (const [i,[dx,dy]] of [[.43,-.47],[.57,-.47],[.57,-.18],[.73,-.18],[.5,.05],[.27,-.18],[.43,-.18]].entries()) {
      if(i===0)ctx.moveTo(x+size*dx,y+size*dy);else ctx.lineTo(x+size*dx,y+size*dy);
    }
    ctx.closePath();ctx.fillStyle='#ffd43b';ctx.strokeStyle='#493400';ctx.lineWidth=Math.max(2,size*.03);ctx.fill();ctx.stroke();
    ctx.restore();
  }

  drawGrid() {
    const gridSize = this.getGridSize();

    // Draw grid cells with padding (legacy style)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        this.ctx.fillStyle = CONFIG.visual.colors.background; // White cell background
        this.ctx.fillRect(
          col * this.effectiveCellSize + this.padding,
          row * this.effectiveCellSize + this.padding,
          this.cellSize,
          this.cellSize
        );
      }
    }
  }

  drawGameObjects(gridMatrix) {
    const gridSize = this.getGridSize(gridMatrix);

    // First pass: draw obstacles (background elements)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellValue = gridMatrix[row][col];

        if (cellValue === GAME_OBJECTS.obstacle) {
          this.drawCell(row, col, cellValue);
        }
      }
    }

    // Second pass: draw goals (middle layer) - always draw goals from gameState
    this.drawGoals();

    // Third pass: handle players with overlap detection (top layer)
    // This ensures players are always drawn on top of goals
    const playerPositions = this.getPlayerPositions(gridMatrix);
    this.drawPlayersWithOverlap(playerPositions);
  }

  drawGoals() {
    // Draw goals from gameState.currentGoals if available
    if (this.gameState && Array.isArray(this.gameState.currentGoals)) {
      const types = Array.isArray(this.gameState.currentGoalTypes)
        ? this.gameState.currentGoalTypes
        : [];
      const claimed = this.gameState.claimedSmallGoals;
      const isClaimed = (idx) => claimed && typeof claimed.has === 'function' && claimed.has(idx);

      this.gameState.currentGoals.forEach((goal, index) => {
        if (goal && Array.isArray(goal) && goal.length >= 2) {
          const [row, col] = goal;
          const type = types[index] || 'small';
          if (type !== 'big' && isClaimed(index)) return;
          this.drawGoalWithPlayerCheck(row, col, type);
        }
      });
    } else {
      // Fallback to grid matrix if currentGoals not available
      const gridSize = this.getGridSize(this.gameState?.gridMatrix);
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const cellValue = this.gameState.gridMatrix[row][col];
          if (cellValue === GAME_OBJECTS.goal || cellValue === GAME_OBJECTS.goal_small || cellValue === GAME_OBJECTS.goal_big) {
            const type = cellValue === GAME_OBJECTS.goal_big ? 'big' : 'small';
            this.drawGoalWithPlayerCheck(row, col, type);
          }
        }
      }
    }
  }

  drawGoalWithPlayerCheck(row, col, type = 'small') {
    // Check if any player is at this goal position
    const hasPlayer = this.isPlayerAtPosition(row, col);

    // Draw goal with transparency if player is on it
    const x = col * this.effectiveCellSize + this.padding;
    const y = row * this.effectiveCellSize + this.padding;

    this.ctx.save();
    this.ctx.fillStyle = CONFIG.visual.colors.goal;

    // Make goal more transparent if player is on it (like legacy version)
    if (hasPlayer) {
      this.ctx.globalAlpha = 0.7; // Same as legacy version
    }

    if (type === 'big') {
      const margin = this.cellSize * 0.08;
      this.ctx.fillRect(x + margin, y + margin, this.cellSize - 2 * margin, this.cellSize - 2 * margin);
    } else {
      const margin = this.cellSize * 0.3;
      this.ctx.fillRect(x + margin, y + margin, this.cellSize - 2 * margin, this.cellSize - 2 * margin);
    }
    this.ctx.restore();
  }

  isPlayerAtPosition(row, col) {
    if (!this.gameState) return false;

    // Check player1
    if (this.gameState.player1 && this.gameState.player1.length === 2) {
      if (this.gameState.player1[0] === row && this.gameState.player1[1] === col) {
        return true;
      }
    }

    // Check player2
    if (this.gameState.player2 && this.gameState.player2.length === 2) {
      if (this.gameState.player2[0] === row && this.gameState.player2[1] === col) {
        return true;
      }
    }

    return false;
  }

  getPlayerPositions(gridMatrix) {
    const gridSize = this.getGridSize(gridMatrix);
    const positions = [];

    // First, collect all player positions from the grid matrix
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellValue = gridMatrix[row][col];
        if (cellValue === GAME_OBJECTS.player || cellValue === GAME_OBJECTS.ai_player) {
          positions.push({ row, col, type: cellValue });
        }
      }
    }

    // If we have gameState with player positions, use those instead
    // This handles the case where both players might be in the same position
    if (this.gameState) {
      positions.length = 0; // Clear existing positions

      // Add player1 if available
      if (this.gameState.player1 && this.gameState.player1.length === 2) {
        positions.push({
          row: this.gameState.player1[0],
          col: this.gameState.player1[1],
          type: GAME_OBJECTS.player
        });
      }

      // Add player2 if available
      if (this.gameState.player2 && this.gameState.player2.length === 2) {
        positions.push({
          row: this.gameState.player2[0],
          col: this.gameState.player2[1],
          type: GAME_OBJECTS.ai_player
        });
      }
    }

    return positions;
  }

  drawPlayersWithOverlap(playerPositions) {
    // Group players by position
    const positionMap = new Map();

    for (const pos of playerPositions) {
      const key = `${pos.row},${pos.col}`;
      if (!positionMap.has(key)) {
        positionMap.set(key, []);
      }
      positionMap.get(key).push(pos);
    }

    // Draw each position using the unified method
    for (const [key, players] of positionMap) {
      const [row, col] = key.split(',').map(Number);
      this.drawOverlappingPlayers(row, col, players);
    }
  }

  drawCell(row, col, cellType) {
    // Use legacy-style positioning with padding
    const x = col * this.effectiveCellSize + this.padding;
    const y = row * this.effectiveCellSize + this.padding;
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    const radius = this.cellSize * 0.35;

    this.ctx.save();

    switch (cellType) {
      case GAME_OBJECTS.player:
      case GAME_OBJECTS.ai_player:
        // Players are handled separately in drawPlayersWithOverlap
        // This method should not be called for players anymore
        break;

      case GAME_OBJECTS.goal:
      case GAME_OBJECTS.goal_small:
        this.ctx.fillStyle = CONFIG.visual.colors.goal;
        this.ctx.fillRect(x + this.cellSize * 0.3, y + this.cellSize * 0.3, this.cellSize * 0.4, this.cellSize * 0.4);
        break;

      case GAME_OBJECTS.goal_big:
        this.ctx.fillStyle = CONFIG.visual.colors.goal;
        this.ctx.fillRect(x + this.cellSize * 0.08, y + this.cellSize * 0.08, this.cellSize * 0.84, this.cellSize * 0.84);
        break;

      case GAME_OBJECTS.obstacle:
        // Draw obstacle (dark square)
        this.ctx.fillStyle = CONFIG.visual.colors.obstacle;
        this.ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
        break;
    }

    this.ctx.restore();
  }



  drawOverlappingPlayers(row, col, players) {
    const x = col * this.effectiveCellSize + this.padding;
    const y = row * this.effectiveCellSize + this.padding;
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    const radius = this.cellSize * 0.35;
    const offset = this.cellSize * 0.15; // Offset for overlap

    this.ctx.save();

    if (players.length === 1) {
      // Single player - draw normally
      this.drawPlayerSprite(players[0].type, centerX, centerY, radius * 2.4);
    } else if (players.length >= 2) {
      // Multiple players - draw overlapping sprites with offset
      this.drawPlayerSprite(players[0].type, centerX - offset, centerY, radius * 2);
      this.drawPlayerSprite(players[1].type, centerX + offset, centerY, radius * 2);
    }

    this.ctx.restore();
  }

  // Additional rendering methods for special effects
  highlightCell(row, col, color = '#ffff00', alpha = 0.3) {
    if (!this.ctx) return;

    const x = col * this.cellSize;
    const y = row * this.cellSize;

    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    this.ctx.restore();
  }

  drawTrajectory(trajectory, color = '#ff0000', alpha = 0.5) {
    if (!this.ctx || !trajectory || trajectory.length < 2) return;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();
    for (let i = 0; i < trajectory.length; i++) {
      const [row, col] = trajectory[i];
      const centerX = col * this.cellSize + this.cellSize / 2;
      const centerY = row * this.cellSize + this.cellSize / 2;

      if (i === 0) {
        this.ctx.moveTo(centerX, centerY);
      } else {
        this.ctx.lineTo(centerX, centerY);
      }
    }
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawNewGoalIndicator(row, col) {
    if (!this.ctx) return;

    const x = col * this.cellSize;
    const y = row * this.cellSize;
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;

    this.ctx.save();

    // Draw pulsing effect
    const time = Date.now() * 0.005;
    const alpha = (Math.sin(time) + 1) * 0.3 + 0.2;

    this.ctx.fillStyle = '#ffff00';
    this.ctx.globalAlpha = alpha;
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

    // Draw "NEW!" text
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = '#ff0000';
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('NEW!', centerX, centerY - 15);

    this.ctx.restore();
  }

  // Animation support
  animateMove(fromRow, fromCol, toRow, toCol, cellType, duration = 200) {
    return new Promise((resolve) => {
      if (!this.ctx) {
        resolve();
        return;
      }

      const startTime = Date.now();
      const fromX = fromCol * this.cellSize + this.cellSize / 2;
      const fromY = fromRow * this.cellSize + this.cellSize / 2;
      const toX = toCol * this.cellSize + this.cellSize / 2;
      const toY = toRow * this.cellSize + this.cellSize / 2;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentX = fromX + (toX - fromX) * easeProgress;
        const currentY = fromY + (toY - fromY) * easeProgress;

        // Clear and redraw (you'd need to store the full game state for this)
        // For now, just draw the moving piece
        this.ctx.save();
        this.ctx.globalAlpha = 0.8;

        const radius = this.cellSize * 0.35;

        this.drawPlayerSprite(cellType, currentX, currentY, radius * 2.4);

        this.ctx.restore();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  // Utility methods
  getCellFromPixel(pixelX, pixelY) {
    const col = Math.floor(pixelX / this.cellSize);
    const row = Math.floor(pixelY / this.cellSize);

    const gridSize = this.getGridSize();
    if (row >= 0 && row < gridSize &&
        col >= 0 && col < gridSize) {
      return { row, col };
    }

    return null;
  }

  getPixelFromCell(row, col) {
    return {
      x: col * this.cellSize + this.cellSize / 2,
      y: row * this.cellSize + this.cellSize / 2
    };
  }
}
