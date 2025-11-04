/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const aliases = {
  '$builder': resolve(__dirname, 'src/lib/builder'),
  '$validator': resolve(__dirname, 'src/lib/builder/validator'),
  '$components': resolve(__dirname, 'src/lib/components'),
  '$test': resolve(__dirname, 'test')
}

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: aliases
  },
  test: {
    include: ['./test/**/*.{test,spec}.ts'],
    alias: aliases
  }
})
