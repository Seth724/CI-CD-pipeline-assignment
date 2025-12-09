// jest.config.js
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test files patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/*.js',
    '!src/server.js'
  ],
  
  // Coverage collection (no strict thresholds for now)
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/*.js',
    '!src/server.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test timeout (reasonable timeout for database operations)
  testTimeout: 15000,
  
  // Run tests serially to avoid conflicts
  maxWorkers: 1,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Force exit after tests complete
  forceExit: true
};