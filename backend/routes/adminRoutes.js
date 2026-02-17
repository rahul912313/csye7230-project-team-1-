const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  blockUser,
  unblockUser,
  deleteUserById,
  getStats,
  searchUsersController,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

/**
 * Admin Routes for QuickRent
 * All routes require authentication and admin role
 */

// Apply auth and admin role middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// User management routes
router.get("/users/search", searchUsersController);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);
router.delete("/users/:id", deleteUserById);

// Statistics routes
router.get("/stats/users", getStats);

module.exports = router;
