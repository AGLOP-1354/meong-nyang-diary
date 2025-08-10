// ESLint v9 flat config bridging from existing .eslintrc.js
// 참고: https://eslint.org/docs/latest/use/configure/migration-guide

const { FlatCompat } = require('@eslint/eslintrc')
const compat = new FlatCompat({ baseDirectory: __dirname })

module.exports = [
  // 호환 레이어로 기존 extends/플러그인 불러오기
  ...compat.extends(
    'expo',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ),
  ...compat.plugins('@typescript-eslint', 'react', 'react-hooks'),

  // 전역 ignore
  { ignores: ['node_modules/', '.expo/', 'dist/', 'build/', 'eslint.config.js', 'jest.config.js', 'jest.setup.ts'] },

  // 프로젝트 규칙
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    settings: {
      react: { version: 'detect' },
      // import/no-unresolved가 TS path alias를 이해하도록 설정
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
]
