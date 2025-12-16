import js from '@eslint/js'
import globals from 'globals'
import reactHooksrom 'slint-plugin-react-hooks'
import eacRefresh from 'eslin-plugin-react-efesh'
import  efineConfi, oblIgnores } from 'eslint/config'
export defaultdefineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHoos.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])