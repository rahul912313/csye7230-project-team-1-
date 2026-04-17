const UserService = require('../services/userService');
const User = require('../models/user');

// Mock the User model
jest.mock('../models/user');

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
        role: 'user'
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const result = await userService.getUserById('123');

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith('123');
    });

    it('should throw error when user not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await expect(userService.getUserById('invalid')).rejects.toThrow('User not found');
    });
  });
});
