// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';

export default [
  // Игнорируемые файлы
  {
    ignores: [],
  },

  // Базовые рекомендации ESLint
  js.configs.recommended,

  // Конфигурации TypeScript ESLint
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Основная конфигурация проекта
  {
    files: ['**/*.{ts,tsx,js,jsx}'],

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig.vite.json', './tsconfig.jest.json'],
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      prettier,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/unbound-method': 'off',

      // Общие
      'no-empty-function': 'off',
      indent: 'off',

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      // Prettier
      'prettier/prettier': 'error',
    },
  },
];
