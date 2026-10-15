import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
let commit = 'unknown';
let dirty = true;
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  dirty = !!execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
} catch (_) {}
const sourceHash = createHash('sha256');
function hashSources(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const filename = `${directory}/${item.name}`;
    if (item.isDirectory()) hashSources(filename);
    else if (item.name.endsWith('.js')) sourceHash.update(filename).update(readFileSync(filename));
  }
}
hashSources('client/src'); hashSources('server');
sourceHash.update(readFileSync('client/main.js'));
const buildInfo = { commit, dirty, sourceHash: sourceHash.digest('hex'), builtAt: new Date().toISOString(), schema: '3.0.0' };

const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop();
const productionBase = process.env.VITE_BASE_PATH
  || `/${githubRepositoryName || 'MinimalCoordinationGame-CHS-unmoderated'}/`;

// Production: GitHub Pages subpath. Development: '/' so /game1.mp4 etc. load on localhost.
export default defineConfig(({ mode }) => ({
  root: 'client',
  define: { __BUILD_INFO__: JSON.stringify(buildInfo) },
  base: mode === 'production' ? productionBase : '/',
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: { '/api/research': 'http://localhost:3001' },
  },
}));
