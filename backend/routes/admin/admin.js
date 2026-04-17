const express = require("express");
const bookingRouter = require("./booking");
const vehicleRouter = require("./vehicle");
const transactionRouter = require("./transaction");
const userRouter = require("./user");
const router = express.Router();

const {
  adminSignup,
  adminLogin,
} = require("../../controllers/adminController");
const authMiddleware = require("../../middlewares/authMiddleware");

// Public routes
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

// Will edit the routes according to the frontend

// Mounting admin-related routes
router.use("/user", userRouter);
router.use("/booking", bookingRouter);
router.use("/vehicle", vehicleRouter);
router.use("/transaction", transactionRouter);

module.exports = router;
