/**
 * PaymentStrategy - Strategy Pattern Interface
 * Defines the contract for all payment strategies
 */
class PaymentStrategy {
  async processPayment(amount, currency, metadata) {
    throw new Error("processPayment() must be implemented by subclass");
  }

  async refundPayment(paymentId, amount) {
    throw new Error("refundPayment() must be implemented by subclass");
  }

  async getPaymentStatus(paymentId) {
    throw new Error("getPaymentStatus() must be implemented by subclass");
  }
}

module.exports = PaymentStrategy;
