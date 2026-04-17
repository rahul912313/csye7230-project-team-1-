const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  providerPaymentId: {
    type: String, // Save Stripe's Payment Intent ID
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Store transaction amount
  },
  currency: {
    type: String,
    default: "usd",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Cancelled"],
    default: "Pending",
  },
  provider: {
    type: String,
    enum: ["stripe", "paypal"],
    default: "stripe",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
