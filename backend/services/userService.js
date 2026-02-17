const User = require("../models/user");
const UserRepository = require("../repositories/UserRepository");
const { hashPassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");

/**
 * User Service for QuickRent
 * Handles user registration, login, and profile management
 */

// Initialize repository
const userRepository = new UserRepository(User);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {String} userData.name - User's full name
 * @param {String} userData.email - User's email
 * @param {String} userData.password - User's password (plain text)
 * @param {String} userData.driverLicense - User's driver license number
 * @returns {Promise<Object>} Created user and token
 */
const registerUser = async (userData) => {
  const { name, email, password, driverLicense } = userData;

  // Check if user with email already exists
  const existingUserByEmail = await userRepository.findByEmail(email);
  if (existingUserByEmail) {
    throw new Error("User with this email already exists");
  }

  // Check if user with driver license already exists
  const existingUserByLicense = await userRepository.findByDriverLicense(driverLicense);
  if (existingUserByLicense) {
    throw new Error("User with this driver license already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const newUser = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    driverLicense,
    role: "user", // Default role
  });

  // Generate JWT token
  const token = generateToken({
    userId: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });

  // Return user without password
  const userResponse = {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    driverLicense: newUser.driverLicense,
    role: newUser.role,
    createdAt: newUser.createdAt,
  };

  return {
    user: userResponse,
    token,
  };
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {String} credentials.email - User's email
 * @param {String} credentials.password - User's password (plain text)
 * @returns {Promise<Object>} User and token
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email (with password)
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const { comparePassword } = require("../utils/passwordUtils");
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken({
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  // Return user without password
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    driverLicense: user.driverLicense,
    role: user.role,
    createdAt: user.createdAt,
  };

  return {
    user: userResponse,
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
