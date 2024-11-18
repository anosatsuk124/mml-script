import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [wasm(), react()],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'MML Script',
      fileName: 'index',
    },
  },
});
