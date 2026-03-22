const express = require("express");
const router = express.Router();
const { chat, getStatus } = require("../controllers/chatbotController");

/**
 * Chatbot Routes for QuickRent
 * No authentication required for better UX
 */

// Chat endpoint
router.post("/", chat);

// Status check endpoint
router.get("/status", getStatus);

module.exports = router;
