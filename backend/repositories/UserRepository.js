const BaseRepository = require("./BaseRepository");

/**
 * UserRepository - Repository for User-specific database operations
 * Extends BaseRepository with User-specific methods
 * 
 * QuickRent Vehicle Rental Platform
 */
class UserRepository extends BaseRepository {
  constructor(userModel) {
    super(userModel);
  }

  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Promise<Object>} User document without password
   */
  async findByEmail(email) {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  /**
   * Find user by email including password field
   * @param {String} email - User email
   * @returns {Promise<Object>} User document with password
   */
  async findByEmailWithPassword(email) {
    try {
      return await this.model.findOne({ email }).select("+password");
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  /**
   * Find user by driver license number
   * @param {String} driverLicense - Driver license number
   * @returns {Promise<Object>} User document
   */
  async findByDriverLicense(driverLicense) {
    try {
      return await this.model.findOne({ driverLicense });
    } catch (error) {
      throw new Error(`Error finding user by driver license: ${error.message}`);
    }
  }

  /**
   * Update user's Firebase token for push notifications
   * @param {String} userId - User ID
   * @param {String} token - Firebase token
   * @returns {Promise<Object>} Updated user document
   */
  async updateFirebaseToken(userId, token) {
    try {
      return await this.model.findByIdAndUpdate(
        userId,
        { firebaseToken: token },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating firebase token: ${error.message}`);
    }
  }

  /**
   * Find user by ID without returning password
   * @param {String} id - User ID
   * @returns {Promise<Object>} User document without password
   */
  async findByIdWithoutPassword(id) {
    try {
      return await this.model.findById(id).select("-password");
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
