const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  storeFirebaseToken,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * User Routes for QuickRent
 */

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/account", authMiddleware, deleteAccount);
router.post("/firebase-token", authMiddleware, storeFirebaseToken);

module.exports = router;
