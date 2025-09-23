/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      '$builder': fileURLToPath(new URL('src/lib/builder', import.meta.url)),
      '$helper': fileURLToPath(new URL('src/lib/builder/helper', import.meta.url)),
      '$components': fileURLToPath(new URL('src/lib/components', import.meta.url))
    }
  },
  test: {
    include: ['./tests/**/*.{test,spec}.ts']
  }
})
