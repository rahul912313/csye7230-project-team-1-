const UserRepository = require("../repositories/UserRepository");
const User = require("../models/user");

/**
 * AdminService - Service Layer for Admin Operations
 * Handles admin-specific business logic for user management
 * Uses Dependency Injection pattern
 * 
 * QuickRent Vehicle Rental Platform
 */
class AdminService {
  constructor(userModel) {
    this.userModel = userModel;
    this.userRepository = new UserRepository(userModel);
  }

  /**
   * Get all users with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated users list
   */
  async getAllUsers(options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = options;

      const sort = this.userRepository.buildSort(sortBy, order);
      const result = await this.userRepository.findWithPagination({}, page, limit, sort);

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
    } catch (e) {
      console.error("Error getting all users:", e.message);
      throw new Error(`Error getting all users: ${e.message}`);
    }
  }

  /**
   * Get user by ID
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User details
   */
  async getUserById(userId) {
    try {
      const user = await this.userRepository.findByIdWithoutPassword(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      console.error("Error getting user by ID:", e.message);
      throw new Error(`Error getting user by ID: ${e.message}`);
    }
  }

  /**
   * Block or unblock user
   * @param {String} userId - User ID
   * @param {Boolean} blockStatus - True to block, false to unblock
   * @returns {Promise<Object>} Updated user status
   */
  async toggleUserBlock(userId, blockStatus) {
    try {
      const updatedUser = await this.userRepository.update(userId, {
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
    } catch (e) {
      console.error("Error toggling user block:", e.message);
      throw new Error(`Error toggling user block: ${e.message}`);
    }
  }

  /**
   * Delete user
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteUser(userId) {
    try {
      const deletedUser = await this.userRepository.delete(userId);
      if (!deletedUser) {
        throw new Error("User not found");
      }

      return {
        message: "User deleted successfully",
        userId: deletedUser._id,
      };
    } catch (e) {
      console.error("Error deleting user:", e.message);
      throw new Error(`Error deleting user: ${e.message}`);
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    try {
      const totalUsers = await this.userRepository.count({ role: "user" });
      const totalAdmins = await this.userRepository.count({ role: "admin" });
      const activeUsers = await this.userRepository.count({
        role: "user",
        isBlocked: { $ne: true },
      });

      return {
        totalUsers,
        totalAdmins,
        activeUsers,
        blockedUsers: totalUsers - activeUsers,
      };
    } catch (e) {
      console.error("Error getting user stats:", e.message);
      throw new Error(`Error getting user stats: ${e.message}`);
    }
  }

  /**
   * Search users by name or email
   * @param {String} searchTerm - Search term
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Search results
   */
  async searchUsers(searchTerm, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;

      const searchFilter = this.userRepository.buildTextSearch(searchTerm, ["name", "email"]);
      const sort = { createdAt: -1 };

      const result = await this.userRepository.findWithPagination(searchFilter, page, limit, sort);

      const usersWithoutPassword = result.data.map((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
      });

      return {
        users: usersWithoutPassword,
        pagination: result.pagination,
      };
    } catch (e) {
      console.error("Error searching users:", e.message);
      throw new Error(`Error searching users: ${e.message}`);
    }
  }
}

module.exports = AdminService;
