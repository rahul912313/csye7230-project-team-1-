const AdminService = require("../services/adminService");
const UserService = require("../services/userService");
const Admin = require("../models/admin");
const User = require("../models/user");
const Booking = require("../models/booking");
const { z } = require("zod");
const mongoose = require("mongoose");

// Initialize services with dependency injection
const adminService = new AdminService(Admin, User, Booking);
const userService = new UserService(User);

const adminSignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Admin Signup
const adminSignup = async (req, res) => {
  // Validate the request body
  const validationResult = adminSignupSchema.safeParse(req.body);

  if (!validationResult.success) {
    // If validation fails
    return res.status(400).json({
      success: false,
      message: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
    });
  }

  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin Login
const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const adminLogin = async (req, res) => {
  // Validate
  const validationResult = adminLoginSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
    });
  }

  try {
    const { email, password } = req.body;
    const { admin, token } = await adminService.loginAdmin(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          name: admin.name,
          email: admin.email,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    // If no users are found
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching all users:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get All Bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await adminService.getAllBookings();

    // If no bookings are found, return a message indicating no data
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found",
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching all bookings:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateUserDetails = async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  // Fields that are allowed to be updated
  const allowedUpdates = ["name", "password"];
  const updateKeys = Object.keys(userData);

  // Check for invalid fields
  const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));
  if (!isValidUpdate) {
    return res.status(400).json({
      success: false,
      message: `Invalid fields: ${updateKeys.filter(
        (key) => !allowedUpdates.includes(key)
      )}`,
    });
  }

  // If password is being updated, hash it
  if (userData.password) {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
  }

  try {
    // Update user data
    const updatedUser = await userService.updateUser(userId, userData);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return updated user details
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  adminSignup,
  adminLogin,
  getAllUsers,
  getAllBookings,
  getUserDetails,
  updateUserDetails,
};
