import { defineConfig, loadEnv } from 'vite';

const githubRepositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop();
const productionBase = process.env.VITE_BASE_PATH
  || `/${githubRepositoryName || 'MinimalCoordinationGame-CHS-unmoderated'}/`;

// Production: GitHub Pages subpath. Development: '/' so /game1.mp4 etc. load on localhost.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const devPort = Number(env.VITE_DEV_SERVER_PORT || 3000);
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://localhost:3001';
  return {
    root: 'client',
    base: mode === 'production' ? productionBase : '/',
    publicDir: 'public',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      port: devPort,
      strictPort: true,
      proxy: {
        '/api': apiTarget,
        '/health': apiTarget,
        '/config': apiTarget,
        '/socket.io': {
          target: apiTarget,
          ws: true,
        },
      },
    },
  };
});
