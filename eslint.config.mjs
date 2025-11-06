import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'

import svelteConfig from './svelte.config.js'

import js from '@eslint/js'
import ts from 'typescript-eslint'
import svelte from 'eslint-plugin-svelte'

// Config
import commonRules from './eslint/eslintCommon.mjs'
import tsRules from './eslint/eslintTs.mjs'
import svelteRules from './eslint/eslintSvelte.mjs'


export default defineConfig([
  // --- GLOBAL ---
  globalIgnores([
    'node_modules/*',
    'public/*',
    'dist/*',
    '.github/*',
    '.vscode/*'
  ]),
  { 
    files: ['./**/*.{js,mjs,ts,svelte}'],
    languageOptions: { globals: globals.browser }
  },

  // --- JS ---
  {
    files: ['./**/*.{js,mjs}'],
    plugins: { js },
    extends: ['js/recommended']
  },

  // --- TS ---
  {
    files: ['./**/*.ts'],
    plugins: { '@typescript-eslint': ts.plugin },
    extends: ts.configs.recommended,
    rules: {
      ...commonRules,
      ...tsRules
    }
  },

  // --- SVELTE ---
  {
    files: ['./**/*.svelte'],
    plugins: {
      svelte,
      '@typescript-eslint': ts.plugin
    },
    extends: ['svelte/recommended'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        project: './tsconfig.json',
        parser: ts.parser,
        svelteConfig
      }
    },
    rules: {
      ...commonRules,
      ...tsRules,
      ...svelteRules
    }
  }
])