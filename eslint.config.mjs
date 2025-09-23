import { defineConfig } from 'eslint/config'
import globals from 'globals'
import svelteConfig from './svelte.config.js'

import js from '@eslint/js'
import ts from 'typescript-eslint'
import svelte from 'eslint-plugin-svelte'

const commonRules = {
  'no-var': 'error',                // Use let, const
  'eqeqeq': ['error'],              // Require === and !==
  'quotes': ['error', 'single'],    // Require '' quotes
  'curly': ['error', 'multi-line'], // Enforce braces for statements
  'indent': ['error', 2],           // Require indentation (2 spaces)
  'no-extra-semi': 'error',         // Disallow unnecessary semicolons
  'semi': ['error', 'never'],       // Disallow semicolons
  'prefer-spread': 'error',         // Enforce spread operators (...)
  'prefer-template': 'error',       // Enforce string templates (`${}`)
  'dot-notation': 'error',          // Enforce prop.name instead of prop['name']
  'default-case': 'error',          // Require default case in switch
  // Use consts when possible
  'prefer-const': ['error', {
    destructuring: 'all',
    ignoreReadBeforeAssign: false
  }],
  // Disable unused for _... variables
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
  }],
  'max-len': ['error', {
    code: 120,
    tabWidth: 2,
    ignoreUrls: true,
    ignoreStrings: true,
    ignoreTemplateLiterals: true,
    ignoreComments: false
  }]
}

export default defineConfig([
  // GLOBAL
  { 
    files: ['./src/**/*.{js,ts,tsx,svelte}'],
    languageOptions: { globals: globals.browser }
  },

  // JS
  {
    files: ['src/**/*.js'],
    plugins: { js },
    extends: ['js/recommended']
  },

  // TS
  {
    files: ['./src/**/*.{ts,tsx}'],
    plugins: { '@typescript-eslint': ts.plugin },
    extends: ts.configs.recommended,
    rules: {
      ...commonRules
    }
  },

  // SVELTE
  {
    files: ['./src/**/*.svelte'],
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
      'svelte/no-target-blank': 'error',
      'svelte/no-top-level-browser-globals': 'error'
    }
  }
])