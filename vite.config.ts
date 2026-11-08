import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        site: resolve('index.html'),
        legacy: resolve('legacy.html'),
        option2: resolve('option-2/index.html'),
      },
    },
  },
});
