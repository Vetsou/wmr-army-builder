/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR_NAME = dirname(fileURLToPath(import.meta.url))

const aliases = {
  '$lib': resolve(DIR_NAME, 'src/lib'),
  '$builder': resolve(DIR_NAME, 'src/lib/builder'),
  '$validator': resolve(DIR_NAME, 'src/lib/builder/validator'),
  '$components': resolve(DIR_NAME, 'src/lib/components'),
  '$test': resolve(DIR_NAME, 'test')
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
