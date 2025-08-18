import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettier from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        axios: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
    },
    extends: [
      js.configs.recommended,
      prettier,
    ],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'linebreak-style': ['error', 'unix'],
    },
  },
]);
