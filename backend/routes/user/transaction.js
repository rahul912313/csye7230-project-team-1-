const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const {
  createTransaction,
  getTransactionByIdForUser,
  getUserTransactions,
} = require("../../controllers/transactionController");

// ------------------------ User Routes ------------------------

// Create a new transaction (User access)
// User can create a new transaction -> does not make sense as transaction is now associated with the payment and webhook
// router.post("/", authMiddleware, createTransaction);

// Get all transactions of the user (User access)
router.get("/", authMiddleware, getUserTransactions); // User can view their own transactions

// Get a specific transaction by ID (User access)
router.get("/:id", authMiddleware, getTransactionByIdForUser); // User can view transaction by ID

module.exports = router;
