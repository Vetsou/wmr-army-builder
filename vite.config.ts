/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import { resolve } from 'node:path'

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
