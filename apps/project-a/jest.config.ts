import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.module\\.css$': 'identity-obj-proxy',
    '^@repo/ui$': '<rootDir>/../../packages/ui/src/index.ts',
    '^@repo/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@repo/constants$': '<rootDir>/../../packages/constants/src/index.ts',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: ['/node_modules/(?!(@repo)/)'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          types: ['jest', 'node'],
        },
      },
    ],
  },
};

export default config;
