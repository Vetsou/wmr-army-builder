/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      '$builder': resolve(__dirname, 'src/lib/builder'),
      '$helper': resolve(__dirname, 'src/lib/builder/helper'),
      '$components': resolve(__dirname, 'src/lib/components')
    }
  },
  test: {
    include: ['./tests/**/*.{test,spec}.ts']
  }
})
