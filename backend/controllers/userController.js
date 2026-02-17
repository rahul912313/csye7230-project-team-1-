const { registerUser } = require("../services/userService");

/**
 * User Controller for QuickRent
 * Handles HTTP requests for user operations
 */

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, driverLicense } = req.body;

    // Validate required fields
    if (!name || !email || !password || !driverLicense) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, password, driverLicense",
      });
    }

    // Register user
    const result = await registerUser({ name, email, password, driverLicense });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Login user
 * @route POST /api/users/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Login user
    const { loginUser } = require("../services/userService");
    const result = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Set by authMiddleware

    const { getUserProfile } = require("../services/userService");
    const profile = await getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // Set by authMiddleware
    const updateData = req.body;

    const { updateUserProfile } = require("../services/userService");
    const updatedProfile = await updateUserProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete user account
 * @route DELETE /api/users/account
 * @access Private
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId; // Set by authMiddleware

    const { deleteUserAccount } = require("../services/userService");
    const result = await deleteUserAccount(userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
};
