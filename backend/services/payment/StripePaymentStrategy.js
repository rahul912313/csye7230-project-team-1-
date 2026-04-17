const PaymentStrategy = require("./PaymentStrategy");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * StripePaymentStrategy - Concrete Strategy for Stripe payments
 * Implements the PaymentStrategy interface for Stripe-specific logic
 */
class StripePaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
    this.stripe = stripe;
  }

  async processPayment(amount, currency, metadata) {
    try {
      // Convert metadata values to strings for Stripe
      const stripeMetadata = {};
      if (metadata) {
        Object.keys(metadata).forEach(key => {
          stripeMetadata[key] = String(metadata[key]);
        });
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Convert to smallest currency unit (cents)
        currency: currency,
        metadata: stripeMetadata,
      });

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        provider: "stripe",
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw new Error(`Stripe payment error: ${error.message}`);
    }
  }

  async refundPayment(paymentId, amount) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount: amount ? amount * 100 : undefined,
      });

      return {
        id: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
        provider: "stripe",
      };
    } catch (error) {
      throw new Error(`Stripe refund error: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        provider: "stripe",
      };
    } catch (error) {
      throw new Error(`Stripe status check error: ${error.message}`);
    }
  }
}

module.exports = StripePaymentStrategy;
