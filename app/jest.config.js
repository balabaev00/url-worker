module.exports = {
  testRegex: '.*\\.(test|spec)\\.ts$',
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  transform: {
    '.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "app/database/migrations/",
    "app/test/",
  ],
  testTimeout: 30000,
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/test/test-environment.ts"],
  transformIgnorePatterns: ['node_modules/(?!axios)'],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    'src/(.*)': '<rootDir>/src/$1',
    'test/(.*)': '<rootDir>/test/$1',
    '@common/(.*)': '<rootDir>/src/common/$1',
    '@health/(.*)': '<rootDir>/src/modules/health/$1',
    '@database/(.*)': '<rootDir>/src/modules/database/$1',
    '@bot/(.*)': '<rootDir>/src/modules/bot/$1',
    '@user/(.*)': '<rootDir>/src/modules/user/$1',
    '@task/(.*)': '<rootDir>/src/modules/task/$1',
    '@support/(.*)': '<rootDir>/src/modules/support/$1',
    '@message/(.*)': '<rootDir>/src/modules/message/$1',
  },
};
