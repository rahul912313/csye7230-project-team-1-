const BaseRepository = require("./BaseRepository");

/**
 * TransactionRepository - Repository for Transaction-specific database operations
 * Extends BaseRepository with Transaction-specific methods
 */
class TransactionRepository extends BaseRepository {
  constructor(transactionModel) {
    super(transactionModel);
  }

  async findByUserId(userId) {
    try {
      return await this.model.find({ userId }).populate("userId");
    } catch (error) {
      throw new Error(`Error finding transactions by user ID: ${error.message}`);
    }
  }

  async findByBookingId(bookingId) {
    try {
      return await this.model.find({ bookingId });
    } catch (error) {
      throw new Error(`Error finding transactions by booking ID: ${error.message}`);
    }
  }

  async findByStatus(status) {
    try {
      return await this.model.find({ status });
    } catch (error) {
      throw new Error(`Error finding transactions by status: ${error.message}`);
    }
  }

  async findByProvider(provider) {
    try {
      return await this.model.find({ provider });
    } catch (error) {
      throw new Error(`Error finding transactions by provider: ${error.message}`);
    }
  }

  async findByProviderPaymentId(providerPaymentId) {
    try {
      return await this.model.findOne({ providerPaymentId });
    } catch (error) {
      throw new Error(`Error finding transaction by provider payment ID: ${error.message}`);
    }
  }

  async updateStatus(transactionId, status) {
    try {
      return await this.model.findByIdAndUpdate(
        transactionId,
        { status },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating transaction status: ${error.message}`);
    }
  }
}

module.exports = TransactionRepository;
