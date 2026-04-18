const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../models/transaction");
const Booking = require("../models/booking"); // Assuming a Booking model exists

const handleStripeWebhookEvent = async (event) => {
  let transaction;

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntentSucceeded = event.data.object;

      // Check if this paymentIntent has already been processed
      transaction = await Transaction.findOne({
        providerPaymentId: paymentIntentSucceeded.id,
        status: "Completed", // Already processed transactions
      });

      if (transaction) {
        console.log("Duplicate transaction detected, ignoring.");
        return transaction; // Exit early if already completed
      }

      // Update the transaction status to "Completed"
      transaction = await Transaction.findOneAndUpdate(
        { providerPaymentId: paymentIntentSucceeded.id },
        { status: "Completed" },
        { new: true }
      );

      console.log("Transaction updated as Completed:", transaction);

      // Confirm the associated booking if payment succeeded
      if (transaction && transaction.bookingId) {
        const booking = await Booking.findByIdAndUpdate(
          transaction.bookingId,
          { status: "confirmed" },
          { new: true }
        );

        console.log("Booking confirmed:", booking);
      } else {
        console.log("No associated booking found for this transaction.");
      }

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntentFailed = event.data.object;

      transaction = await Transaction.findOneAndUpdate(
        { providerPaymentId: paymentIntentFailed.id },
        { status: "Failed" },
        { new: true }
      );

      console.log("Transaction updated as Failed:", transaction);

      break;
    }

    case "payment_intent.canceled": {
      const paymentIntentCanceled = event.data.object;

      transaction = await Transaction.findOneAndUpdate(
        { providerPaymentId: paymentIntentCanceled.id },
        { status: "Cancelled" },
        { new: true }
      );

      console.log("Transaction updated as Cancelled:", transaction);

      if (transaction && transaction.bookingId) {
        const booking = await Booking.findByIdAndUpdate(
          transaction.bookingId,
          { status: "canceled" },
          { new: true }
        );

        console.log("Booking marked as Cancelled:", booking);
      }

      break;
    }

    default: {
      console.log(`Unhandled event type: ${event.type}`);
    }
  }

  return transaction;
};

module.exports = { handleStripeWebhookEvent };
