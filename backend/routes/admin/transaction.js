const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");
const {
  getAllTransactions,
  getTransactionById,
  updateTransactionStatus,
  getAllTransactionsOfUser,
} = require("../../controllers/transactionController");

// Get all transactions (Admin access)
router.get("/", authMiddleware, roleMiddleware("admin"), getAllTransactions); // Admin can view all transactions

// Get a specific transaction by ID (Admin access)
router.get("/:id", authMiddleware, roleMiddleware("admin"), getTransactionById); // Admin can view transaction by ID

router.get(
  "/user/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getAllTransactionsOfUser
);

// Update transaction status (Admin access)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateTransactionStatus
); // Admin can update transaction status - expects status in the body

module.exports = router;
