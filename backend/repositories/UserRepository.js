const BaseRepository = require("./BaseRepository");

/**
 * UserRepository - Repository for User-specific database operations
 * Extends BaseRepository with User-specific methods
 */
class UserRepository extends BaseRepository {
  constructor(userModel) {
    super(userModel);
  }

  async findByEmail(email) {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async findByEmailWithPassword(email) {
    try {
      return await this.model.findOne({ email }).select("+password");
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async findByDriverLicense(driverLicense) {
    try {
      return await this.model.findOne({ driverLicense });
    } catch (error) {
      throw new Error(`Error finding user by driver license: ${error.message}`);
    }
  }

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

  async findByIdWithoutPassword(id) {
    try {
      return await this.model.findById(id).select("-password");
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
