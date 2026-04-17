const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getBookingsOfUser,
  updateBooking,
  cancelBooking,
  getAllBookingsOfAllUsers,
} = require("../../controllers/bookingController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

// Admin route: Get all bookings of all users
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllBookingsOfAllUsers
);

// Admin route: Get bookings for a specific user by userId (pass userId as query param)
router.get(
  "/user/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getBookingsOfUser
); // Admin can get bookings for a specific user

// Create a new booking -> we can add it if needed on frontend
// router.post("/", authMiddleware, roleMiddleware("admin"), createBooking); // Assume user role for booking creation

// Get booking by ID (accessible to admin)
router.get("/:id", authMiddleware, roleMiddleware("admin"), getBookingById);

// Update booking (accessible to admin and user)
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateBooking); // Allow user role to update their own booking

// Cancel booking (for both admin and user, admin can cancel for others) -> or we could just use the update call above to cancel the booking
router.put(
  "/cancel/:id",
  authMiddleware,
  roleMiddleware("admin"),
  cancelBooking
);

module.exports = router;
