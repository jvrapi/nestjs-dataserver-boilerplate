import { readFileSync } from 'fs';
import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const swcConfig = JSON.parse(readFileSync(`${__dirname}/.swcrc`, 'utf-8'));

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  setupFiles: ['./test/dotenv.ts'],
  coverageReporters: ['text-summary', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  reporters: ['default'],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@/*': ['src/*'],
      '@tests/*': ['./test/*'],
    },
    {
      prefix: '<rootDir>',
    },
  ),
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        ...swcConfig,
      },
    ],
  },
  collectCoverageFrom: [
    'src/core/**/*.(t|j)s',
    '!src/infrastructure/**/*.(t|j)s',
    '!src/presentation/**/*.(t|j)s',
    '!src/**/base.(t|j)s',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  testEnvironment: 'node',
};

export default config;
