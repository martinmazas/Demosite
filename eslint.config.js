const playwright = require('eslint-plugin-playwright');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'fixtures/**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'playwright/expect-expect': ['warn', { assertFunctionNames: ['expect', /^verify/] }],
    },
  },
];
