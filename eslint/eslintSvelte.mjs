export default {
  // Handled by svelte rules
  'prefer-const': 'off',

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