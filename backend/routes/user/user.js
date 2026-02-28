const express = require("express");
// const bookingRouter = require("./booking"); // Saumya's scope
// const vehicleRouter = require("./vehicle"); // Saumya's scope
// const transactionRouter = require("./transaction"); // Saumya's scope

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  storeFirebaseToken,
} = require("../../controllers/userController");

const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// User routes

router.post("/signup", registerUser);
router.post("/login", loginUser);

router.get("/", authMiddleware, getUserProfile);
router.put("/", authMiddleware, updateUserProfile);

// Mounting other user-related routes (will be added by Saumya)
// router.use("/booking", bookingRouter);
// router.use("/vehicle", vehicleRouter);
// router.use("/transaction", transactionRouter);

// Firebase token storage
router.post("/store-token", authMiddleware, storeFirebaseToken);

module.exports = router;
