const Booking = require("../models/booking");
const Transaction = require("../models/transaction");

/**
 * Update booking status after successful payment
 * This is called from frontend after Stripe confirms payment
 */
const updateBookingStatusAfterPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentIntentId } = req.body;

    // Verify the payment intent actually succeeded
    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Payment intent ID is required",
      });
    }

    // Find the transaction to verify payment
    const transaction = await Transaction.findOne({
      providerPaymentId: paymentIntentId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Update booking status to confirmed
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "confirmed" },
      { new: true }
    ).populate("vehicle user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Also update transaction status if needed
    if (transaction.status !== "Completed") {
      transaction.status = "Completed";
      await transaction.save();
    }

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: { booking },
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

module.exports = {
  updateBookingStatusAfterPayment,
};
