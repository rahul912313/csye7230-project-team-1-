const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createPayment } = require("../controllers/paymentController");
const { updateBookingStatusAfterPayment } = require("../controllers/paymentStatusController");

// Payment route - Only accessible by authenticated users
router.post("/", authMiddleware, createPayment);

// Update booking status after payment success
router.post("/confirm/:bookingId", authMiddleware, updateBookingStatusAfterPayment);

module.exports = router;

// Test Cards for Reference:
// Success: 4242 4242 4242 4242
// Declined: 4000 0000 0000 0002
// Authentication required (3D Secure): 4000 0025 0000 3155
// Authentication succeeds: 4000 0027 6000 3184
// Authentication fails: 4000 0027 9000 3184
// Insufficient funds: 4000 0000 0000 9995
// Expired card: 4000 0000 0000 0069
// Incorrect CVC: 4000 0000 0000 0127
// Processing error: 4000 0000 0000 0119
