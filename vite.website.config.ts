import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve('website'),
  plugins: [react()],
  publicDir: resolve('website/public'),
  build: { outDir: resolve('build'), emptyOutDir: true },
  server: { host: '127.0.0.1', port: 4180, strictPort: true },
});
