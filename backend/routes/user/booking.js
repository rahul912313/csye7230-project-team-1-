const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getAllUserBookings,
  updateBooking,
  cancelBooking,
  requestBooking,
  confirmBookingWithPayment,
} = require("../../controllers/bookingController");
const authMiddleware = require("../../middlewares/authMiddleware");

// Create a new booking (user-specific)
router.post("/", authMiddleware, createBooking);

// Get booking by ID (user-specific)
router.get("/:id", authMiddleware, getBookingById);

// Get all bookings for the logged-in user
router.get("/", authMiddleware, getAllUserBookings);

// Update booking (user-specific)
router.put("/:id", authMiddleware, updateBooking);

// Cancel booking (user-specific, updating status to "Cancelled")
router.put("/cancel/:id", authMiddleware, cancelBooking);

// NEW: Two-Phase Booking System (Industry Best Practice)
// Phase 1: Request booking (creates temporary lock)
router.post("/request", authMiddleware, requestBooking);

// Phase 2: Confirm booking with payment (atomic operation)
router.post("/confirm", authMiddleware, confirmBookingWithPayment);

module.exports = router;
