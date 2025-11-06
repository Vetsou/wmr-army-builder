export default {
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/array-type': ['error', { default: 'array' }],
  '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
  '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
  '@typescript-eslint/method-signature-style': ['error', 'method'],
  '@typescript-eslint/no-confusing-non-null-assertion': 'error',
  '@typescript-eslint/no-for-in-array': 'error',
  '@typescript-eslint/no-inferrable-types': 'error',
  '@typescript-eslint/no-invalid-void-type': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',

  // Extend recommended rule with unused '_var' variable names
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
  }],

  // Naming convention
  '@typescript-eslint/naming-convention': [
    'error',
    {
      selector: 'default',
      format: ['camelCase'],
      leadingUnderscore: 'allow',
      trailingUnderscore: 'allow'
    },
    {
      selector: 'import',
      format: ['camelCase', 'PascalCase']
    },
    {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE'],
      leadingUnderscore: 'allow',
      trailingUnderscore: 'allow'
    },
    {
      selector: 'typeLike',
      format: ['PascalCase']
    }
  ]
}