const { z } = require("zod");
const TransactionService = require("../services/transactionService");
const Transaction = require("../models/transaction");

// Initialize service with dependency injection
const transactionService = new TransactionService(Transaction);
const mongoose = require("mongoose");

//Creates the transaction in entry in db and mark it as pending
const createTransaction = async (req, res) => {
  // Logic
  try {
    const transactionSchema = z.object({
      user: z.string(),
      booking: z.string(),
    });

    const validatedData = transactionSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validatedData.error.errors,
      });
    }
    const transaction = await transactionService.createTransaction(
      validatedData.data
    );

    res.status(201).json({
      message: "Transaction is pending",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Get transactions by User id
const getTransactionById = async (req, res) => {
  // Logic
  try {
    const transactionId = req.params.id;
    const transaction = await transactionService.getTransactionById(
      transactionId
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    res.status(200).json({
      transaction,
    });
  } catch (e) {
    console.error("Error fetching transaction: ", e.message);

    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
};

//get transactions of particular user
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch transactions from the service layer
    const transactions = await transactionService.getAllTransactions(userId);

    // Check if transactions exist or if the array is empty
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        message: "No transactions found",
      });
    }

    res.status(200).json({
      success: true,
      transactions,
      count: transactions.length,
    });
  } catch (e) {
    console.error("Error fetching all transactions:", e);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message || e,
    });
  }
};

// Update the transaction status or cancel it
const updateTransactionStatus = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { status } = req.body; // status is passed in the body
    console.log(status);

    // Validate if the status is provided
    if (!status) {
      return res.status(400).json({
        message: "Status is required to update the transaction",
      });
    }

    // Find the transaction by ID
    const transaction = await transactionService.getTransactionById(
      transactionId
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    // Check if the status is valid
    const validStatuses = ["pending", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Valid statuses are: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    // Save the updated transaction to the database
    const updatedTransaction = await transactionService.updateTransactionStatus(
      transaction._id,
      status
    );

    res.status(200).json({
      message: "Transaction status updated successfully",
      transaction: updatedTransaction,
    });
  } catch (e) {
    console.error("Error updating the transaction status: ", e.message);

    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
};

// Get all transactions of that user using id from middleware
const getTransactionByIdForUser = async (req, res) => {
  try {
    const userId = req.userId;
    const transactionId = req.params.id;

    const transaction = await transactionService.getTransactionByIdForUser(
      transactionId,
      userId
    );

    if (!transaction) {
      return res.status(404).json({
        message:
          "Transaction not found or you don't have permission to view it",
      });
    }

    res.status(200).json({
      transaction,
    });
  } catch (e) {
    console.error("Error fetching transaction:", e.message);
    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
};

const updateTransactionForUser = async () => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;
    const { status } = req.body;

    const transaction = await transactionService.getTransactionById(
      transactionId,
      userId
    );

    if (!transaction) {
      return res.status(404).json({
        message:
          "Transaction not found or you don't have permission to update it",
      });
    }

    // Proceed with status update
    const updatedTransaction = await transactionService.updateTransactionStatus(
      transactionId,
      status
    );

    res.status(200).json({
      message: "Transaction status updated successfully",
      transaction: updatedTransaction,
    });
  } catch (e) {
    console.error("Error updating the transaction status:", e.message);
    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    // Fetch all transactions from the database
    const transactions = await transactionService.getAllTransactions();
    console.log(transactions);
    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found",
      });
    }

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllTransactionsOfUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Fetch all transactions for the user from the database
    const transactions = await transactionService.getTransactionsByUserId(id);

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions for user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransactionStatus,
  getUserTransactions,
  getTransactionByIdForUser,
  updateTransactionForUser,
  getAllTransactionsOfUser,
};
