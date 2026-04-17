const express = require("express");
const bookingRouter = require("./booking");
const vehicleRouter = require("./vehicle");
const transactionRouter = require("./transaction");

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

// Will edit the routes according to the frontend

// Mounting other user-related routes
router.use("/booking", bookingRouter);
router.use("/vehicle", vehicleRouter);
router.use("/transaction", transactionRouter);

// Fugu
router.post("/store-token", authMiddleware, storeFirebaseToken);

module.exports = router;
