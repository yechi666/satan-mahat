module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:vue/essential', 'airbnb-base', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'linebreak-style': 'off',
    'operator-linebreak': ['error', 'after', { overrides: { '?': 'ignore', ':': 'ignore' } }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'comma-dangle': ['error', 'only-multiline'],
    'no-param-reassign': [2, { props: false }],
    'object-shorthand': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'implicit-arrow-linebreak': 0,
    'import/prefer-default-export': 'off',
    'object-curly-newline': [
      'error',
      {
        ExportDeclaration: { multiline: true, minProperties: 5 },
      },
    ],
    radix: 'off',
    'no-nested-ternary': 'off',
    'function-paren-newline': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
