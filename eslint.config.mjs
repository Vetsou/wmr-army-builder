import { defineConfig, globalIgnores } from 'eslint/config'
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

  // Disable unused for _... variables
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
  }],
  
  // Max line length
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
  // --- GLOBAL ---
  globalIgnores([
    'node_modules/*',
    'public/*',
    'dist/*',
    '.github/*',
    '.vscode/*'
  ]),
  { 
    files: ['./**/*.{js,ts,svelte}'],
    languageOptions: { globals: globals.browser }
  },

  // --- JS ---
  {
    files: ['./**/**/*.js'],
    plugins: { js },
    extends: ['js/recommended']
  },

  // --- TS ---
  {
    files: ['./**/**/*.ts'],
    plugins: { '@typescript-eslint': ts.plugin },
    extends: ts.configs.recommended,
    rules: {
      ...commonRules,

      // Use consts when possible
      'prefer-const': ['error', {
        destructuring: 'all',
        ignoreReadBeforeAssign: false
      }]
    }
  },

  // --- SVELTE ---
  {
    files: ['./**/**/*.svelte'],
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
      'prefer-const': 'off', // handled by Svelte linter

      'svelte/no-target-blank': 'error',                             // disallows using target="_blank"
      'svelte/prefer-class-directive': 'error',                      // class directives instead of ternary operation
      'svelte/no-top-level-browser-globals': 'error',                // disallow top-level browser global variables
      'svelte/html-closing-bracket-new-line': 'error',               // disallow a '\n' before tag's closing brackets
      'svelte/indent': 'error',                                      // consistent indentation
      'svelte/shorthand-attribute': ['error', { prefer: 'always' }], // use shorthand syntax in attribute
      'svelte/shorthand-directive': ['error', { prefer: 'always' }], // use shorthand syntax in directives
      'svelte/prefer-const': 'error',                                // prefer const variables
      'svelte/no-spaces-around-equal-signs-in-attribute': 'error',   // no spaces around '=' in html

      // Enforcing unified spacing in mustaches
      'svelte/mustache-spacing': [
        'error',
        {
          "textExpressions": "always",
          "attributesAndProps": "always",
          "directiveExpressions": "always",
          "tags": {
            "openingBrace": "never",
            "closingBrace": "never"
          }
        }
      ],

      // Disallow specific HTML elements
      'svelte/no-restricted-html-elements': [
        "error",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "marquee", "big", "center", "font",
        "small", "u", "tt", "blink", "applet",
        "acronym", "dir", "menu", "isindex",
        "basefont"
      ]
    }
  }
])