const express = require("express");
const router = express.Router();
const { chat, getStatus } = require("../controllers/chatbotController");

// Chatbot endpoints - No auth required for better UX
router.post("/", chat);
router.get("/status", getStatus);

module.exports = router;
