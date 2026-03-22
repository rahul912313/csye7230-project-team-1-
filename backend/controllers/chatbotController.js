const ChatbotService = require("../services/chatbotService");

/**
 * Chatbot Controller for QuickRent
 * Handles AI chatbot interactions using Hugging Face API
 */

const chatbotService = new ChatbotService();

/**
 * Handle chatbot conversation
 * @route POST /api/chatbot
 * @access Public
 */
const chat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Limit message length
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message too long. Please keep it under 500 characters.",
      });
    }

    // Check for fallback response first (faster)
    const fallbackResponse = chatbotService.getFallbackResponse(message);
    
    if (fallbackResponse) {
      return res.status(200).json({
        success: true,
        reply: fallbackResponse,
        source: "fallback",
        timestamp: new Date().toISOString(),
      });
    }

    // Get AI response
    const reply = await chatbotService.chat(
      message,
      conversationHistory || []
    );

    res.status(200).json({
      success: true,
      reply: reply,
      source: "ai",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chatbot controller error:", error);
    
    res.status(500).json({
      success: false,
      message: "I'm having trouble right now. Please try again or contact support!",
      error: error.message,
    });
  }
};

/**
 * Get chatbot status
 * @route GET /api/chatbot/status
 * @access Public
 */
const getStatus = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      status: "online",
      model: "microsoft/DialoGPT-medium",
      provider: "Hugging Face",
      message: "QuickRent AI Assistant is ready to help!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "offline",
      message: "Chatbot is currently unavailable",
    });
  }
};

module.exports = { chat, getStatus };
