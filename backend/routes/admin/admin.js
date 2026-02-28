const express = require("express");
// const bookingRouter = require("./booking"); // Saumya's scope
// const vehicleRouter = require("./vehicle"); // Saumya's scope
// const transactionRouter = require("./transaction"); // Saumya's scope
const userRouter = require("./user");
const router = express.Router();

const {
  adminSignup,
  adminLogin,
  getAllBookings,
} = require("../../controllers/adminController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

// Public routes
router.post("/signup", adminSignup);
router.post("/login", adminLogin);

// Mounting admin-related routes
router.use("/user", userRouter);

// Get all bookings (will be implemented by Saumya)
// router.get("/booking", authMiddleware, roleMiddleware("admin"), getAllBookings);

// Mounting other admin-related routes (will be added by Saumya and Abbas)
// router.use("/booking", bookingRouter);
// router.use("/vehicle", vehicleRouter);
// router.use("/transaction", transactionRouter);

module.exports = router;
