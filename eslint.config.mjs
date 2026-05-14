import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      'no-empty-function': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unused-vars': ['off'],
      '@typescript-eslint/explicit-function-return-type': ['warn'],
      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          singleQuote: true,
          semi: false,
          printWidth: 80,
          trailingComma: 'all',
          quoteProps: 'consistent',
        },
      ],
    },
  },
]);
