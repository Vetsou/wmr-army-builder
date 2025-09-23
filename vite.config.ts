/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      '$builder': path.resolve(__dirname, 'src/lib/builder'),
      '$helper': path.resolve(__dirname, 'src/lib/builder/helper'),
      '$components': path.resolve(__dirname, 'src/lib/components')
    }
  },
  test: {
    include: ['./tests/**/*.{test,spec}.ts']
  }
})
