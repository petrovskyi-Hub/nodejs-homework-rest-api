module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    // 'jest/globals': true,
  },
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:json/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'jest/no-mocks-import': 'off',
    // 'comma-dangle': 'off',
    // 'space-before-function-paren': 'off',
  },
};
