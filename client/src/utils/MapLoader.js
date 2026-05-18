// Map loading and randomization utility based on legacy version
import { CONFIG } from '../config/gameConfig.js';
import mapsFor1P1GRaw from '../../../config/MapsFor1P1G.js?raw';
import mapsFor1P2GRaw from '../../../config/MapsFor1P2G.js?raw';
import mapsFor2P2GRaw from '../../../config/MapsFor2P2G.js?raw';
import mapsFor2P3GRaw from '../../../config/MapsFor2P3G.js?raw';

const BUNDLED_MAP_FILES = {
  '1P1G': mapsFor1P1GRaw,
  '1P2G': mapsFor1P2GRaw,
  '2P2G': mapsFor2P2GRaw,
  '2P3G': mapsFor2P3GRaw
};

export class MapLoader {
  constructor() {
    this.mapData = null;
    this.initialize();
  }

  async initialize() {
    this.mapData = await this.loadMapData();
  }

  // Load map data from bundled config files so static GitHub Pages builds work
  async loadMapData() {
    console.log('🗺️ Loading bundled map data...');
    const maps = {};
    
    for (const [expType, rawMapFile] of Object.entries(BUNDLED_MAP_FILES)) {
      try {
        maps[expType] = this.parseBundledMapFile(expType, rawMapFile);
        console.log(`✅ Loaded ${Object.keys(maps[expType]).length} ${expType} maps from bundled config`);
      } catch (error) {
        console.warn(`⚠️ Failed to load bundled ${expType} maps, using fallback:`, error.message);
        maps[expType] = this.getFallbackMaps(expType);
      }
    }

    // Log summary of loaded maps
    for (const [expType, mapData] of Object.entries(maps)) {
      const mapCount = mapData ? Object.keys(mapData).length : 0;
      console.log(`🗺️ ${expType}: ${mapCount} maps loaded`);
    }

    return maps;
  }

  parseBundledMapFile(experimentType, rawMapFile) {
    const varName = `MapsFor${experimentType}`;
    const regex = new RegExp(`var\\s+${varName}\\s*=\\s*({[\\s\\S]*?});`);
    const match = rawMapFile.match(regex);

    if (!match) {
      throw new Error(`Could not find ${varName} declaration`);
    }

    return JSON.parse(match[1]);
  }

  // Fallback generation methods
  generate1P1GMaps() {
    console.log('🔧 Generating fallback 1P1G maps...');
    const maps = {};
    // Generate 20 different 1P1G maps with some variety
    for (let i = 0; i < 20; i++) {
      // Add some variation to make maps more interesting
      const startRow = 7;
      const startCol = 1 + (i % 3);
      const goalRow = 2 + Math.floor(i / 4);
      const goalCol = 10 + (i % 5);
      
      maps[String(i)] = [{
        initPlayerGrid: [startRow, startCol],
        target1: [goalRow, goalCol],
        mapType: '1P1G'
      }];
    }
    console.log(`✅ Generated ${Object.keys(maps).length} fallback 1P1G maps`);
    return maps;
  }

  generate1P2GMaps() {
    const maps = {};
    // Generate 20 different 1P2G maps
    for (let i = 0; i < 20; i++) {
      maps[String(i)] = [{
        initPlayerGrid: [7, 1],
        target1: [3, 7],
        target2: [11, 7],
        mapType: '1P2G'
      }];
    }
    return maps;
  }

  generate2P2GMaps() {
    const maps = {};
    // Generate different 2P2G configurations (based on legacy patterns)
    const configurations = [
      { player1: [7, 2], player2: [7, 14], goal1: [1, 8], goal2: [14, 8] },
      { player1: [2, 7], player2: [14, 7], goal1: [8, 1], goal2: [8, 13] },
      { player1: [7, 1], player2: [7, 13], goal1: [3, 7], goal2: [11, 7] },
      { player1: [1, 7], player2: [13, 7], goal1: [7, 3], goal2: [7, 11] },
      { player1: [3, 3], player2: [11, 11], goal1: [3, 11], goal2: [11, 3] },
      { player1: [5, 2], player2: [9, 12], goal1: [2, 7], goal2: [12, 7] },
      { player1: [2, 5], player2: [12, 9], goal1: [7, 2], goal2: [7, 12] },
      { player1: [6, 1], player2: [8, 13], goal1: [1, 6], goal2: [13, 8] }
    ];

    for (let i = 0; i < 99; i++) {
      const config = configurations[i % configurations.length];
      // Add some variation
      const variation = Math.floor(i / configurations.length);

      maps[String(297 + i)] = [{
        initPlayerGrid: config.player1,
        initAIGrid: config.player2,
        target1: config.goal1,
        target2: config.goal2,
        mapType: '2P2G'
      }];
    }
    return maps;
  }

  generate2P3GMaps() {
    const maps = {};
    // 2P3G maps are similar to 2P2G but start with only 2 goals
    // The third goal appears dynamically during gameplay
    const configurations = [
      { player1: [7, 2], player2: [7, 14], goal1: [1, 8], goal2: [14, 8] },
      { player1: [2, 7], player2: [14, 7], goal1: [8, 1], goal2: [8, 13] },
      { player1: [7, 1], player2: [7, 13], goal1: [3, 7], goal2: [11, 7] },
      { player1: [1, 7], player2: [13, 7], goal1: [7, 3], goal2: [7, 11] },
      { player1: [3, 3], player2: [11, 11], goal1: [3, 11], goal2: [11, 3] },
      { player1: [5, 2], player2: [9, 12], goal1: [2, 7], goal2: [12, 7] },
      { player1: [2, 5], player2: [12, 9], goal1: [7, 2], goal2: [7, 12] },
      { player1: [6, 1], player2: [8, 13], goal1: [1, 6], goal2: [13, 8] }
    ];

    for (let i = 0; i < 99; i++) {
      const config = configurations[i % configurations.length];

      maps[String(397 + i)] = [{
        initPlayerGrid: config.player1,
        initAIGrid: config.player2,
        target1: config.goal1,
        target2: config.goal2,
        mapType: '2P3G'
      }];
    }
    return maps;
  }

  // Get maps for specific experiment type
  getMapsForExperiment(experimentType) {
    console.log(`🎯 Getting maps for experiment: ${experimentType}`);
    
    if (!this.mapData) {
      console.warn('⚠️ Map data not loaded yet, using fallback');
      return this.getFallbackMaps(experimentType);
    }

    const mapData = this.mapData[experimentType];
    if (!mapData) {
      console.error(`❌ No map data available for experiment type: ${experimentType}`);
      return this.getFallbackMaps(experimentType);
    }
    
    console.log(`✅ Found ${Object.keys(mapData).length} maps for ${experimentType}`);
    return mapData;
  }

  // Get fallback maps when config files are not available
  getFallbackMaps(experimentType) {
    switch (experimentType) {
      case '1P1G':
        return this.generate1P1GMaps();
      case '1P2G':
        return this.generate1P2GMaps();
      case '2P2G':
        return this.generate2P2GMaps();
      case '2P3G':
        return this.generate2P3GMaps();
      default:
        console.error(`Unknown experiment type: ${experimentType}`);
        return {};
    }
  }

  // Select random maps from map data (legacy compatible)
  selectRandomMaps(mapData, nTrials) {
    if (!mapData || typeof mapData !== 'object') {
      console.error('Invalid map data provided:', mapData);
      return [];
    }

    const keys = Object.keys(mapData);
    if (keys.length === 0) {
      console.error('No keys found in map data');
      return [];
    }

    const selectedMaps = [];
    for (let i = 0; i < nTrials; i++) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      // Map data structure is: { "key": [{ designObject }] }
      const mapArray = mapData[randomKey];
      if (Array.isArray(mapArray) && mapArray.length > 0) {
        selectedMaps.push({ ...mapArray[0] }); // Clone the design object
      }
    }

    console.log(`Selected ${selectedMaps.length} random maps from ${keys.length} available maps`);
    return selectedMaps;
  }

  // Get random map for collaboration games (post trial 12)
  getRandomMapForCollaborationGame(experimentType, trialIndex) {
    // After trial 12, use random sampling
    if (trialIndex >= CONFIG.game.successThreshold.randomSamplingAfterTrial) {
      const mapData = this.getMapsForExperiment(experimentType);
      console.log(`Getting random map for ${experimentType} trial ${trialIndex + 1}, mapData:`, mapData);

      if (!mapData || Object.keys(mapData).length === 0) {
        console.error(`No map data available for ${experimentType}`);
        return this.createFallbackDesign(experimentType);
      }

      // Deterministic selection for multiplayer sync: derive index from room seed + trialIndex
      try {
        const keys = Object.keys(mapData);
        if (keys.length === 0) return this.createFallbackDesign(experimentType);
        const seed = Number(window.__SESSION_SEED__ || 0);
        // Simple deterministic hash mixing
        let h = 2166136261 >>> 0; // FNV-1a basis
        const str = `${experimentType}|${trialIndex}|${seed}`;
        for (let i = 0; i < str.length; i++) {
          h ^= str.charCodeAt(i);
          h = Math.imul(h, 16777619);
        }
        const idx = Math.abs(h) % keys.length;
        const key = keys[idx];
        const arr = mapData[key];
        if (Array.isArray(arr) && arr.length > 0) {
          return { ...arr[0] };
        }
      } catch (_) {
        // Fallback to prior random method if any issue
        const randomMaps = this.selectRandomMaps(mapData, 1);
        if (randomMaps.length > 0) return randomMaps[0];
      }

      console.error(`No selectable maps for ${experimentType}`);
      return this.createFallbackDesign(experimentType);
    } else {
      // Use pre-selected map from timeline (this would be handled by TimelineManager)
      console.log(`Using timeline map data for ${experimentType} trial ${trialIndex}`);
      return null; // Signal to use timeline data
    }
  }

  // Create fallback design when no map data available
  createFallbackDesign(experimentType) {
    const fallbackDesigns = {
      '1P1G': {
        initPlayerGrid: [7, 1],
        target1: [7, 7],
        mapType: '1P1G'
      },
      '1P2G': {
        initPlayerGrid: [7, 1],
        target1: [3, 7],
        target2: [11, 7],
        mapType: '1P2G'
      },
      '2P2G': {
        initPlayerGrid: [7, 2],
        initAIGrid: [7, 14],
        target1: [1, 8],
        target2: [14, 8],
        mapType: '2P2G'
      },
      '2P3G': {
        initPlayerGrid: [7, 2],
        initAIGrid: [7, 14],
        target1: [1, 8],
        target2: [14, 8],
        mapType: '2P3G'
      }
    };

    return fallbackDesigns[experimentType] || fallbackDesigns['1P1G'];
  }

  // Server health check
  async checkServerHealth() {
    try {
      const response = await fetch('/health', { 
        method: 'GET',
        timeout: 2000 // 2 second timeout
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Load all fallback maps when server is unavailable
  loadAllFallbackMaps() {
    console.log('🔧 Loading all fallback maps...');
    return {
      '1P1G': this.getFallbackMaps('1P1G'),
      '1P2G': this.getFallbackMaps('1P2G'),
      '2P2G': this.getFallbackMaps('2P2G'),
      '2P3G': this.getFallbackMaps('2P3G')
    };
  }
}

// Create singleton instance
export const mapLoader = new MapLoader();
