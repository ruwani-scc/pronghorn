/**
 * ESLint Configuration
 * Code quality and style enforcement for backend JavaScript
 */

module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier'
  ],
  
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  
  plugins: ['node'],
  
  rules: {
    // Error prevention
    'no-console': 'off', // Allow console in backend
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    
    // Code quality
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-throw-literal': 'error',
    'no-return-await': 'error',
    
    // Node.js specific
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',
    'node/no-missing-require': 'error',
    'node/no-unpublished-require': 'off',
    'node/no-extraneous-require': 'error',
    
    // Best practices
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'warn',
    'no-promise-executor-return': 'error',
    'require-atomic-updates': 'error',
    
    // Style (delegated to Prettier mostly)
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    
    // Complexity
    'complexity': ['warn', 10],
    'max-depth': ['warn', 4],
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    'max-params': ['warn', 5]
  },
  
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      },
      rules: {
        'node/no-unpublished-require': 'off',
        'max-lines': 'off'
      }
    }
  ]
};
