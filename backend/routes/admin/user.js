const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const {
  getAllUsers,
  getUserDetails,
  updateUserDetails,
} = require("../../controllers/adminController");

// Admin-specific routes for user management

// Get all users (admin access)
router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers); // Admin can view all users

// Get a specific user's details by ID (admin access)
router.get("/:id", authMiddleware, roleMiddleware("admin"), getUserDetails); // Admin can view user details by user ID

// Update a specific user's details (admin access)
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateUserDetails); // Admin can update user profile

module.exports = router;
