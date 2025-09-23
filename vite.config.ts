/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
