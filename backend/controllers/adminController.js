const {
  getAllUsers,
  getUserById,
  toggleUserBlock,
  deleteUser,
  getUserStats,
  searchUsers,
} = require("../services/adminService");

/**
 * Admin Controller for QuickRent
 * Handles HTTP requests for admin operations
 */

/**
 * Get all users
 * @route GET /api/admin/users
 * @access Private (Admin only)
 */
const getUsers = async (req, res) => {
  try {
    const { page, limit, sortBy, order } = req.query;

    const result = await getAllUsers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortBy,
      order,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/admin/users/:id
 * @access Private (Admin only)
 */
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Block user
 * @route PUT /api/admin/users/:id/block
 * @access Private (Admin only)
 */
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await toggleUserBlock(id, true);

    res.status(200).json({
      success: true,
      message: result.message,
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
 * Unblock user
 * @route PUT /api/admin/users/:id/unblock
 * @access Private (Admin only)
 */
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await toggleUserBlock(id, false);

    res.status(200).json({
      success: true,
      message: result.message,
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
 * Delete user
 * @route DELETE /api/admin/users/:id
 * @access Private (Admin only)
 */
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUser(id);

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

/**
 * Get user statistics
 * @route GET /api/admin/stats/users
 * @access Private (Admin only)
 */
const getStats = async (req, res) => {
  try {
    const stats = await getUserStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Search users
 * @route GET /api/admin/users/search
 * @access Private (Admin only)
 */
const searchUsersController = async (req, res) => {
  try {
    const { q, page, limit } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const result = await searchUsers(q, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  blockUser,
  unblockUser,
  deleteUserById,
  getStats,
  searchUsersController,
};
