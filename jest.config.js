/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/libs/utils/$1',
    '^@/constants/(.*)$': '<rootDir>/constants/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/stores/(.*)$': '<rootDir>/stores/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/libs/(.*)$': '<rootDir>/libs/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
