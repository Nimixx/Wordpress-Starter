module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['jest', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off', // Allow console for CLI applications
    'max-len': ['error', { code: 120 }], // Allow slightly longer line length
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    'class-methods-use-this': 'off', // Allow class methods that don't use 'this'
    'no-param-reassign': ['error', { props: false }], // Allow param property reassign
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.js', '**/*.spec.js', 'jest.config.js'],
      },
    ],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['**/test/**/*.js'],
      rules: {
        'jest/no-conditional-expect': 'off',
      },
    },
  ],
};
