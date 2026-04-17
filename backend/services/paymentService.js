const PaymentService = require("./payment/PaymentService");
const StripePaymentStrategy = require("./payment/StripePaymentStrategy");
const Transaction = require("../models/transaction");

/**
 * Initialize Payment Service with Stripe Strategy
 * This demonstrates the Strategy Pattern in action
 */
const stripeStrategy = new StripePaymentStrategy();
const paymentService = new PaymentService(stripeStrategy, Transaction);

/**
 * Legacy function for backward compatibility
 * Uses the new PaymentService with Strategy Pattern internally
 */
const createPaymentIntent = async (amount, currency, userId, bookingId) => {
  return await paymentService.createPaymentIntent(amount, currency, userId, bookingId);
};

module.exports = { 
  createPaymentIntent,
  paymentService // Export the service instance for advanced usage
};
