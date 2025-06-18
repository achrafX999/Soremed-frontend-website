import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.VITE_API_BASE_URL;         // ex: http://localhost:8080/api
  const backendUrl   = apiBaseUrl.replace(/\/api\/?$/, ''); // ex: http://localhost:8080

  return {
    plugins: [ react(), tsconfigPaths() ],

    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, '/api'),
        },
        '/images/news': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, '/api'),
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
