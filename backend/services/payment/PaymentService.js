/**
 * PaymentService - Context for Strategy Pattern
 * Manages payment processing using different payment strategies
 * Allows runtime switching between payment providers
 */
class PaymentService {
  constructor(paymentStrategy, transactionModel) {
    this.paymentStrategy = paymentStrategy;
    this.transactionModel = transactionModel;
  }

  /**
   * Set or switch payment strategy at runtime
   */
  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  /**
   * Process payment using the current strategy
   */
  async createPaymentIntent(amount, currency, userId, bookingId) {
    try {
      // Process payment using the current strategy
      const paymentResult = await this.paymentStrategy.processPayment(
        amount,
        currency,
        { userId, bookingId }
      );

      // Save transaction to database
      const transaction = new this.transactionModel({
        userId,
        bookingId,
        providerPaymentId: paymentResult.id,
        amount,
        currency,
        status: "Pending",
        provider: paymentResult.provider,
      });

      await transaction.save();

      return {
        paymentIntent: paymentResult,
        transaction,
      };
    } catch (error) {
      throw new Error(`Payment processing error: ${error.message}`);
    }
  }

  /**
   * Refund a payment using the current strategy
   */
  async refundPayment(paymentId, amount) {
    try {
      return await this.paymentStrategy.refundPayment(paymentId, amount);
    } catch (error) {
      throw new Error(`Refund error: ${error.message}`);
    }
  }

  /**
   * Get payment status using the current strategy
   */
  async getPaymentStatus(paymentId) {
    try {
      return await this.paymentStrategy.getPaymentStatus(paymentId);
    } catch (error) {
      throw new Error(`Status check error: ${error.message}`);
    }
  }
}

module.exports = PaymentService;
