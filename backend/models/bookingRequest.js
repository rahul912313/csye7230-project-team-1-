const mongoose = require("mongoose");

/**
 * BookingRequest Schema
 * Represents a temporary booking lock before payment
 * Prevents race conditions and double-booking
 */
const bookingRequestSchema = new mongoose.Schema({
  requestToken: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: "End date must be after the start date",
    },
  },
  priceQuote: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true, // For efficient cleanup
  },
  status: {
    type: String,
    enum: ["active", "confirmed", "expired", "canceled"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL Index: Automatically delete expired requests after 30 minutes
bookingRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("BookingRequest", bookingRequestSchema);
