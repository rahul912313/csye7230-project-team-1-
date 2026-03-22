const UserService = require('../services/userService');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Test Suite for UserService
 * Tests user service business logic
 */

// Mock the User model and dependencies
jest.mock('../models/user');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService(User);
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when valid id is provided', async () => {
      const mockUser = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        driverLicense: 'DL123456'
      };

      // Mock the repository method
      userService.userRepository.findByIdWithoutPassword = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.getUserById('123');

      expect(result).toEqual(mockUser);
      expect(userService.userRepository.findByIdWithoutPassword).toHaveBeenCalledWith('123');
    });

    it('should throw error when user not found', async () => {
      userService.userRepository.findByIdWithoutPassword = jest.fn().mockResolvedValue(null);

      await expect(userService.getUserById('invalid')).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        driverLicense: 'DL123456'
      };

      const mockUser = {
        _id: '123',
        name: userData.name,
        email: userData.email,
        password: 'hashed_password',
        role: 'user',
        driverLicense: userData.driverLicense
      };

      userService.userRepository.findByEmail = jest.fn().mockResolvedValue(null);
      userService.userRepository.findByDriverLicense = jest.fn().mockResolvedValue(null);
      userService.userRepository.create = jest.fn().mockResolvedValue(mockUser);
      
      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');
      jwt.sign = jest.fn().mockReturnValue('mock_token');

      const result = await userService.createUser(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(userService.userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(userService.userRepository.findByDriverLicense).toHaveBeenCalledWith(userData.driverLicense);
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        driverLicense: 'DL123456'
      };

      userService.userRepository.findByEmail = jest.fn().mockResolvedValue({ email: userData.email });

      await expect(userService.createUser(userData)).rejects.toThrow('User already exists with this email');
    });

    it('should throw error if driver license already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        driverLicense: 'DL123456'
      };

      userService.userRepository.findByEmail = jest.fn().mockResolvedValue(null);
      userService.userRepository.findByDriverLicense = jest.fn().mockResolvedValue({ driverLicense: userData.driverLicense });

      await expect(userService.createUser(userData)).rejects.toThrow('Driver license already registered');
    });
  });

  describe('loginUser', () => {
    it('should return user and token on successful login', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        role: 'user'
      };

      userService.userRepository.findByEmailWithPassword = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('mock_token');

      const result = await userService.loginUser(credentials.email, credentials.password);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(userService.userRepository.findByEmailWithPassword).toHaveBeenCalledWith(credentials.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
    });

    it('should throw error when user not found', async () => {
      userService.userRepository.findByEmailWithPassword = jest.fn().mockResolvedValue(null);

      await expect(userService.loginUser('invalid@email.com', 'password')).rejects.toThrow();
    });

    it('should throw error when password is invalid', async () => {
      const mockUser = {
        _id: '123',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword'
      };

      userService.userRepository.findByEmailWithPassword = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(userService.loginUser('john@example.com', 'wrongpassword')).rejects.toThrow();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '123';
      const updateData = { name: 'Jane Doe' };
      const mockUpdatedUser = {
        _id: userId,
        name: 'Jane Doe',
        email: 'john@example.com'
      };

      User.findOne = jest.fn().mockResolvedValue(null); // No duplicate email
      userService.userRepository.update = jest.fn().mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(userId, updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(userService.userRepository.update).toHaveBeenCalled();
    });

    it('should hash password if password is being updated', async () => {
      const userId = '123';
      const updateData = { password: 'newpassword123' };
      const mockUpdatedUser = {
        _id: userId,
        name: 'John Doe',
        email: 'john@example.com'
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_new_password');
      userService.userRepository.update = jest.fn().mockResolvedValue(mockUpdatedUser);

      await userService.updateUser(userId, updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 'salt');
    });
  });

  describe('updateFirebaseToken', () => {
    it('should update firebase token successfully', async () => {
      const userId = '123';
      const token = 'firebase_token_123';
      const mockUser = {
        _id: userId,
        firebaseToken: token
      };

      userService.userRepository.updateFirebaseToken = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.updateFirebaseToken(userId, token);

      expect(result).toEqual(mockUser);
      expect(userService.userRepository.updateFirebaseToken).toHaveBeenCalledWith(userId, token);
    });

    it('should throw error when user not found', async () => {
      userService.userRepository.updateFirebaseToken = jest.fn().mockResolvedValue(null);

      await expect(userService.updateFirebaseToken('invalid', 'token')).rejects.toThrow('User not found');
    });
  });
});
