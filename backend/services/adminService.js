const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * AdminService - Service Layer for Admin Management
 * Implements business logic for admin operations
 * Uses Dependency Injection for better testability and modularity
 */
class AdminService {
  constructor(adminModel, userModel, bookingModel) {
    this.adminModel = adminModel;
    this.userModel = userModel;
    this.bookingModel = bookingModel;
  }

  async createAdmin(adminData) {
    try {
      // Check if admin exists
      const existingAdmin = await this.adminModel.findOne({ email: adminData.email });
      if (existingAdmin) {
        throw new Error("Admin already exists with this email");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Create admin and set role as "admin"
      const admin = await this.adminModel.create({
        ...adminData,
        password: hashedPassword,
        role: "admin",
      });

      return admin;
    } catch (e) {
      console.error("Error creating admin: ", e.message);
      throw new Error(`Error creating admin: ${e.message}`);
    }
  }

  async loginAdmin(email, password) {
    try {
      // Find admin
      const admin = await this.adminModel.findOne({ email }).select("+password");
      if (!admin) {
        throw new Error("Invalid credentials");
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      // Generate token
      const token = jwt.sign(
        { userId: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return { admin, token };
    } catch (e) {
      console.error("Admin login failed: ", e.message);
      throw new Error(`Admin login failed: ${e.message}`);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userModel.find({}).select("-password");
      return users;
    } catch (e) {
      console.error("Error fetching all users: ", e.message);
      throw new Error(`Error fetching users: ${e.message}`);
    }
  }

  async getAllBookings() {
    try {
      const bookings = await this.bookingModel.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
      return bookings;
    } catch (e) {
      console.error("Error fetching all bookings: ", e.message);
      throw new Error(`Error fetching bookings: ${e.message}`);
    }
  }
}

module.exports = AdminService;
