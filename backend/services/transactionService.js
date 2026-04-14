/**
 * TransactionService - Service Layer for Transaction Management
 * Implements business logic for transaction operations
 * Uses Dependency Injection for better testability and modularity
 */
class TransactionService {
  constructor(transactionModel) {
    this.transactionModel = transactionModel;
  }

  async createTransaction(data) {
    try {
      const savedTransaction = await this.transactionModel.create(data);
      return savedTransaction;
    } catch (e) {
      console.error("Transaction failed: ", e.message);
      throw new Error(`Transaction failed: ${e.message}`);
    }
  }

  async getTransactionById(transactionId) {
    try {
      const transaction = await this.transactionModel.findOne({ _id: transactionId });
      return transaction;
    } catch (e) {
      console.error(
        `Error fetching transaction with transaction id - ${transactionId} : `,
        e.message
      );
      throw new Error(
        `Error fetching transaction with transaction id - ${transactionId} : ${e.message}`
      );
    }
  }

  async getAllTransactionsOfUser(userId) {
    try {
      const transaction = await this.transactionModel.find({ userId: userId }).populate(
        "userId"
      );
      return transaction;
    } catch (e) {
      console.error(`Error fetching transactions with ${userId} : `, e.message);
      throw new Error(`Error fetching transactions with ${userId} : ${e.message}`);
    }
  }

  async getAllTransactions() {
    try {
      const transactions = await this.transactionModel.find();
      return transactions;
    } catch (error) {
      throw new Error("Error fetching transactions: " + error.message);
    }
  }

  async updateTransactionStatus(transactionId, status) {
    try {
      const transaction = await this.transactionModel.findOneAndUpdate(
        { _id: transactionId },
        { status },
        { new: true }
      );
      return transaction;
    } catch (e) {
      console.error(
        `Error updating transaction with ${transactionId} : `,
        e.message
      );
      throw new Error(
        `Error updating transaction with ${transactionId} : ${e.message}`
      );
    }
  }

  async getTransactionByIdForUser(transactionId, userId) {
    try {
      // Find the transaction that belongs to the user
      const transaction = await this.transactionModel.findOne({
        _id: transactionId,
        user: userId,
      });

      return transaction;
    } catch (e) {
      console.error(
        `Error fetching transaction with ID ${transactionId}: `,
        e.message
      );
      throw new Error(
        `Error fetching transaction with ID ${transactionId}: ${e.message}`
      );
    }
  }

  async getTransactionsByUserId(userId) {
    try {
      // Fetch all transactions for the given userId
      const transactions = await this.transactionModel.find({ userId });
      return transactions;
    } catch (error) {
      throw new Error("Error fetching transactions for user: " + error.message);
    }
  }
}

module.exports = TransactionService;
