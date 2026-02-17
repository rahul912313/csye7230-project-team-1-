const User = require("../models/user");
const UserRepository = require("../repositories/UserRepository");

/**
 * Admin Service for QuickRent
 * Handles admin operations for user management
 */

// Initialize repository
const userRepository = new UserRepository(User);

/**
 * Get all users with pagination
 * @param {Object} options - Query options
 * @param {Number} options.page - Page number
 * @param {Number} options.limit - Items per page
 * @param {String} options.sortBy - Field to sort by
 * @param {String} options.order - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated users list
 */
const getAllUsers = async (options = {}) => {
  const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = options;

  const sort = userRepository.buildSort(sortBy, order);
  const result = await userRepository.findWithPagination({}, page, limit, sort);

  // Remove passwords from all users
  const usersWithoutPassword = result.data.map((user) => {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  });

  return {
    users: usersWithoutPassword,
    pagination: result.pagination,
  };
};

/**
 * Get user by ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} User details
 */
const getUserById = async (userId) => {
  const user = await userRepository.findByIdWithoutPassword(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

/**
 * Block/Unblock user
 * @param {String} userId - User ID
 * @param {Boolean} blockStatus - True to block, false to unblock
 * @returns {Promise<Object>} Updated user
 */
const toggleUserBlock = async (userId, blockStatus) => {
  const updatedUser = await userRepository.update(userId, {
    isBlocked: blockStatus,
  });

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return {
    message: blockStatus ? "User blocked successfully" : "User unblocked successfully",
    userId: updatedUser._id,
    isBlocked: updatedUser.isBlocked,
  };
};

/**
 * Delete user by admin
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Deletion confirmation
 */
const deleteUser = async (userId) => {
  const deletedUser = await userRepository.delete(userId);
  if (!deletedUser) {
    throw new Error("User not found");
  }

  return {
    message: "User deleted successfully",
    userId: deletedUser._id,
  };
};

/**
 * Get user statistics
 * @returns {Promise<Object>} User statistics
 */
const getUserStats = async () => {
  const totalUsers = await userRepository.count({ role: "user" });
  const totalAdmins = await userRepository.count({ role: "admin" });
  const activeUsers = await userRepository.count({
    role: "user",
    isBlocked: { $ne: true },
  });

  return {
    totalUsers,
    totalAdmins,
    activeUsers,
    blockedUsers: totalUsers - activeUsers,
  };
};

/**
 * Search users by name or email
 * @param {String} searchTerm - Search term
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} Search results
 */
const searchUsers = async (searchTerm, options = {}) => {
  const { page = 1, limit = 10 } = options;

  const searchFilter = userRepository.buildTextSearch(searchTerm, ["name", "email"]);
  const sort = { createdAt: -1 };

  const result = await userRepository.findWithPagination(searchFilter, page, limit, sort);

  const usersWithoutPassword = result.data.map((user) => {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  });

  return {
    users: usersWithoutPassword,
    pagination: result.pagination,
  };
};

module.exports = {
  getAllUsers,
  getUserById,
  toggleUserBlock,
  deleteUser,
  getUserStats,
  searchUsers,
};
