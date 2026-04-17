const AdminService = require('../services/adminService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Test Suite for AdminService
 * Tests admin service business logic including:
 * - Admin creation with password hashing
 * - Admin login with JWT generation
 * - User management operations
 * - Booking retrieval
 *
 * QuickRent Vehicle Rental Platform
 */

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockAdminModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockUserModel = {
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockBookingModel = {
  find: jest.fn(),
};

describe('AdminService', () => {
  let adminService;

  beforeEach(() => {
    adminService = new AdminService(mockAdminModel, mockUserModel, mockBookingModel);
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  // ─── createAdmin ───────────────────────────────────────────
  describe('createAdmin', () => {
    it('should create a new admin with hashed password and role=admin', async () => {
      const adminData = { name: 'Admin User', email: 'admin@quickrent.com', password: 'adminpass123' };
      const mockCreated = { _id: 'admin123', ...adminData, password: 'hashed_password', role: 'admin' };

      mockAdminModel.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashed_password');
      mockAdminModel.create.mockResolvedValue(mockCreated);

      const result = await adminService.createAdmin(adminData);

      expect(result).toEqual(mockCreated);
      expect(mockAdminModel.findOne).toHaveBeenCalledWith({ email: adminData.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(adminData.password, 'salt');
      expect(mockAdminModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'admin', password: 'hashed_password' })
      );
    });

    it('should throw error if admin already exists with that email', async () => {
      const adminData = { name: 'Admin', email: 'admin@quickrent.com', password: 'pass' };
      mockAdminModel.findOne.mockResolvedValue({ email: adminData.email });

      await expect(adminService.createAdmin(adminData)).rejects.toThrow(
        'Admin already exists with this email'
      );
      expect(mockAdminModel.create).not.toHaveBeenCalled();
    });

    it('should always force role to admin regardless of input role', async () => {
      const adminData = { name: 'Sneaky', email: 'sneaky@test.com', password: 'pass', role: 'superadmin' };

      mockAdminModel.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashed');
      mockAdminModel.create.mockResolvedValue({ ...adminData, role: 'admin' });

      await adminService.createAdmin(adminData);

      expect(mockAdminModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'admin' })
      );
    });
  });

  // ─── loginAdmin ────────────────────────────────────────────
  describe('loginAdmin', () => {
    it('should return admin and JWT token on valid credentials', async () => {
      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@quickrent.com',
        password: '$2b$10$hashedpassword',
        role: 'admin',
      };

      mockAdminModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAdmin),
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock_admin_token');

      const result = await adminService.loginAdmin('admin@quickrent.com', 'adminpass123');

      expect(result).toHaveProperty('admin');
      expect(result).toHaveProperty('token', 'mock_admin_token');
      expect(bcrypt.compare).toHaveBeenCalledWith('adminpass123', mockAdmin.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ userId: mockAdmin._id, role: 'admin' }),
        'test_secret',
        expect.any(Object)
      );
    });

    it('should throw error when admin email is not found', async () => {
      mockAdminModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(adminService.loginAdmin('notfound@test.com', 'pass')).rejects.toThrow(
        'Invalid credentials'
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error when password is incorrect', async () => {
      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@quickrent.com',
        password: '$2b$10$hashedpassword',
        role: 'admin',
      };

      mockAdminModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAdmin),
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(adminService.loginAdmin('admin@quickrent.com', 'wrongpass')).rejects.toThrow(
        'Invalid credentials'
      );
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  // ─── getAllUsers ────────────────────────────────────────────
  describe('getAllUsers', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = [
        { _id: '1', name: 'Alice', email: 'alice@test.com' },
        { _id: '2', name: 'Bob', email: 'bob@test.com' },
      ];

      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers),
      });

      const result = await adminService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockUserModel.find).toHaveBeenCalledWith({});
    });

    it('should return empty array when no users exist', async () => {
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([]),
      });

      const result = await adminService.getAllUsers();
      expect(result).toEqual([]);
    });
  });

  // ─── getAllBookings ─────────────────────────────────────────
  describe('getAllBookings', () => {
    it('should return all bookings with populated user info', async () => {
      const mockBookings = [
        { _id: 'b1', userId: { name: 'Alice', email: 'alice@test.com' } },
        { _id: 'b2', userId: { name: 'Bob', email: 'bob@test.com' } },
      ];

      mockBookingModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockBookings),
      });

      const result = await adminService.getAllBookings();
      expect(result).toEqual(mockBookings);
    });

    it('should return empty array when bookingModel is not provided', async () => {
      const serviceWithoutBooking = new AdminService(mockAdminModel, mockUserModel, null);
      const result = await serviceWithoutBooking.getAllBookings();
      expect(result).toEqual([]);
    });
  });
});
