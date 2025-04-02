import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginVue from 'eslint-plugin-vue';
import eslintPluginNuxt from 'eslint-plugin-nuxt';
import prettier from 'eslint-config-prettier';
import * as vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: [
      '.nuxt/**/*',
      'dist/**/*',
      '.output/**/*',
      'node_modules/**/*',
    ],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      'vue': eslintPluginVue,
    },
    rules: {
      ...eslintPluginVue.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'vue/attributes-order': 'warn',
    },
  },
  {
    files: ['**/*.{js,cjs,mjs,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'nuxt': eslintPluginNuxt,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...eslintPluginNuxt.configs.recommended.rules,
      ...prettier.rules,
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'no-undef': 'off', // TypeScript handles this better
    },
  },
];
