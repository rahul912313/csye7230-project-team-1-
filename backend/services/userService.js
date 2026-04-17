const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * UserService - Service Layer for User Management
 * Implements business logic for user operations
 * Uses Dependency Injection for better testability and modularity
 */
class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async createUser(userData) {
    try {
      // Check if user exists
      const existingUser = await this.userModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const role = "user";

      // Create user
      const user = await this.userModel.create({
        ...userData,
        password: hashedPassword,
        role: role,
      });

      // Generating token with userId and role
      const token = jwt.sign(
        { userId: user._id, role: user.role },
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

  async loginUser(email, password) {
    try {
      // Find user
      const user = await this.userModel.findOne({ email }).select("+password");
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
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return { user, token };
    } catch (e) {
      console.error("Login failed: ", e.message);
      throw new Error(`Login failed: ${e.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.userModel.findById(userId).select("-password");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      console.error(`Error fetching user with id ${userId}: `, e.message);
      throw new Error(`Error fetching user: ${e.message}`);
    }
  }

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
      const user = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      return user;
    } catch (e) {
      console.error(`Error updating user: `, e.message);
      throw new Error(`Error updating user: ${e.message}`);
    }
  }
}

module.exports = UserService;
