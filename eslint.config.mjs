import globals from 'globals';
import js from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    files: ['**/*.js'],
    rules: {
      'no-console': 'off', // Allow console for CLI applications
      'max-len': 'off', // Temporarily disable line length restrictions
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-parens': ['error', 'always'],
      'class-methods-use-this': 'off', // Allow class methods that don't use 'this'
      'no-param-reassign': ['error', { props: false }], // Allow param property reassign
      'no-unused-vars': ['warn', { // Downgrade to warning and ignore some patterns
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
    ignores: ['node_modules/', 'coverage/'],
  },
  {
    files: ['**/*.test.js', '**/*.spec.js', 'jest.config.js'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'jest/no-conditional-expect': 'warn',
      'jest/no-done-callback': 'warn',
      'jest/no-jasmine-globals': 'warn',
    },
  },
];