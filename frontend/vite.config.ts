/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // NestJS routes: /api/estimate/* (singular, no trailing 's') → NestJS :3001
      '^/api/estimate(?!s)': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Everything else → Django (auth, users, cms, pricing, estimates, admin)
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
