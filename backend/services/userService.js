const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const User = require("../models/user");

/**
 * UserService - Service Layer for User Management
 * Implements business logic for user operations
 * Uses Dependency Injection for better testability and modularity
 * 
 * QuickRent Vehicle Rental Platform
 */
class UserService {
  constructor(userModel) {
    this.userModel = userModel;
    this.userRepository = new UserRepository(userModel);
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user and token
   */
  async createUser(userData) {
    try {
      // Check if user exists by email
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      // Check if user exists by driver license
      const existingLicense = await this.userRepository.findByDriverLicense(userData.driverLicense);
      if (existingLicense) {
        throw new Error("Driver license already registered");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const role = "user";

      // Create user
      const user = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
        role: role,
      });

      // Generate token with userId and role
      const token = jwt.sign(
        { userId: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      return { user, token };
    } catch (e) {
      console.error("Error creating user: ", e.message);
      throw new Error(`Error creating user: ${e.message}`);
    }
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Object>} User and token
   */
  async loginUser(email, password) {
    try {
      // Find user with password
      const user = await this.userRepository.findByEmailWithPassword(email);
      if (!user) {
        throw new Error("User not found");
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      // Generate token with userId and role
      const token = jwt.sign(
        { userId: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return { user, token };
    } catch (e) {
      console.error("Login failed: ", e.message);
      throw new Error(`Login failed: ${e.message}`);
    }
  }

  /**
   * Get user by ID
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(userId) {
    try {
      const user = await this.userRepository.findByIdWithoutPassword(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      console.error(`Error fetching user with id ${userId}: `, e.message);
      throw new Error(`Error fetching user: ${e.message}`);
    }
  }

  /**
   * Update user
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updateData) {
    try {
      // If updating email, check if it exists and is not being used by another user
      if (updateData.email) {
        const existingUser = await this.userModel.findOne({
          email: updateData.email,
          _id: { $ne: userId },
        });
        if (existingUser) {
          throw new Error("Email already in use");
        }
      }

      // If updating password, hash it
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      // Update user data
      const user = await this.userRepository.update(
        userId,
        updateData,
        { new: true, runValidators: true }
      );

      return user;
    } catch (e) {
      console.error(`Error updating user: `, e.message);
      throw new Error(`Error updating user: ${e.message}`);
    }
  }

  /**
   * Update Firebase token
   * @param {String} userId - User ID
   * @param {String} token - Firebase token
   * @returns {Promise<Object>} Updated user
   */
  async updateFirebaseToken(userId, token) {
    try {
      const user = await this.userRepository.updateFirebaseToken(userId, token);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      console.error("Error updating Firebase token:", e.message);
      throw new Error(`Error updating Firebase token: ${e.message}`);
    }
  }
}

module.exports = UserService;
