// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl: string = env.VITE_API_BASE_URL;
  const backendUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  return {
    plugins: [
      react(),
      tsconfigPaths(),  // ← c'est lui qui active les alias @/...
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
        '/images/news': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
    },
  };
});
