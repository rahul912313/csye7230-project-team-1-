// Jest setup file
// Mocks and global test configuration

// Mock environment variables
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.MONGO_URI = 'mongodb://localhost:27017/quickrent_test';
process.env.NODE_ENV = 'test';

// Dummy test to satisfy Jest requirement
test('environment is configured for testing', () => {
  expect(process.env.NODE_ENV).toBe('test');
});
