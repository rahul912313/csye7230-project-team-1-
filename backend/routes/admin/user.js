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
router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);

// Get a specific user's details by ID (admin access)
router.get("/:id", authMiddleware, roleMiddleware("admin"), getUserDetails);

// Update a specific user's details (admin access)
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateUserDetails);

module.exports = router;
