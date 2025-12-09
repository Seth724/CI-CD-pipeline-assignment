// tests/setup.js
// Global test setup for Jest

// Set test timeout
jest.setTimeout(30000);

// Suppress console.log during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Global test configuration
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  
  // Configure MongoDB Memory Server for CI
  if (process.env.CI) {
    process.env.MONGOMS_DISABLE_POSTINSTALL = 'true';
    process.env.MONGOMS_VERSION = '7.0.4';
    process.env.MONGOMS_DOWNLOAD_DIR = '/tmp/mongodb-binaries';
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception:', error);
});