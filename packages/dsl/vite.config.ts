import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [wasm()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'MML Script',
      fileName: 'index',
    },
  },
});
