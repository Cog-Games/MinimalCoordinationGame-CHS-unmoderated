import {CONFIG, GAME_OBJECTS, GameConfigUtils} from '../config/gameConfig.js';
// Select once at trial initialization so the cue does not move as the child walks.
export function practiceGuidance(state) {
  const script = GameConfigUtils.getStagHuntScriptedRound(state.experimentType, state.trialIndex);
  if (!script) return null;
  const player = CONFIG.game.players.player1.type === 'human' ? 1 : 2;
  const start = state[`player${player}`], goals = state.currentGoals, types = state.currentGoalTypes;
  const queue = [[...start, 0]], seen = new Set([start.join(',')]);
  while (queue.length) {
    const [r,c,d] = queue.shift();
    const goal = goals.findIndex(g=>g[0]===r&&g[1]===c);
    if (goal >= 0) {
      if (types[goal] === script.human) return {target:[r,c], targetType:script.human, player, distance:d};
      continue; // Other ovens lock movement; don't route through them.
    }
    for (const [dr,dc] of [[0,-1],[0,1],[-1,0],[1,0]]) {
      const nr=r+dr,nc=c+dc,key=`${nr},${nc}`;
      if (nr<0||nc<0||nr>=state.gridMatrix.length||nc>=state.gridMatrix.length||seen.has(key)||state.gridMatrix[nr][nc]===GAME_OBJECTS.obstacle) continue;
      seen.add(key);queue.push([nr,nc,d+1]);
    }
  }
  return null;
}
