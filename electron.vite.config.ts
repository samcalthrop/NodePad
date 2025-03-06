import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    optimizeDeps: {
      exclude: ['chunk-7LZ2TQWD.js?v=30a74ddd', '@tabler/icons-react'],
    },
    resolve: {
      alias: {
        '@renderer/*': resolve(__dirname, 'src/renderer/src'),
        '@resources': resolve(__dirname, 'resources'),
      },
    },
    plugins: [react()],
  },
});
