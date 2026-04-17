const express = require("express");
const router = express.Router();
const {
  sendNotificationController,
} = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

// Send Notification Route
router.post("/send", authMiddleware, sendNotificationController);

module.exports = router;
