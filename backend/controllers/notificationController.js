const NotificationService = require("../services/notificationService");
const User = require("../models/user");

// Initialize service with dependency injection
const notificationService = new NotificationService(User);

/**
 * Controller for sending notifications
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const sendNotificationController = async (req, res) => {
  const { userId, message, type } = req.body;

  if (!userId || !message) {
    return res.status(400).json({
      success: false,
      message: "UserId and message are required",
    });
  }

  try {
    const response = await notificationService.sendNotification(
      userId,
      message,
      type || "push"
    );
    return res.status(200).json({
      success: true,
      message: "Notification sent successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendNotificationController,
};
