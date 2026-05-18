import { defineConfig } from 'vite';

const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop();
const productionBase = process.env.VITE_BASE_PATH
  || `/${githubRepositoryName || 'MinimalCoordinationGame-CHS-unmoderated'}/`;

// Production: GitHub Pages subpath. Development: '/' so /game1.mp4 etc. load on localhost.
export default defineConfig(({ mode }) => ({
  root: 'client',
  base: mode === 'production' ? productionBase : '/',
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
}));
