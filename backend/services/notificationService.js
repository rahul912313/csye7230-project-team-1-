const NotificationFactory = require("./notification/NotificationFactory");

/**
 * NotificationService - Service Layer for Notification Management
 * Uses Factory Pattern to create different types of notifications
 * Uses Dependency Injection for User model
 */
class NotificationService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  /**
   * Send notification to a user using specified type
   * @param {string} userId - The user's ID
   * @param {string} message - The message to send
   * @param {string} type - Type of notification ('push', 'email', 'sms')
   */
  async sendNotification(userId, message, type = "push") {
    try {
      // Fetch user to get their contact info
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Create notification using Factory Pattern
      const notification = NotificationFactory.createNotification(type);

      let recipient;
      let messageData;

      // Prepare recipient and message based on type
      switch (type.toLowerCase()) {
        case "push":
          if (!user.firebaseToken) {
            throw new Error("Firebase token missing for user");
          }
          recipient = user.firebaseToken;
          messageData = {
            title: "New Booking Alert",
            body: message,
          };
          break;

        case "email":
          recipient = user.email;
          messageData = {
            title: "New Booking Alert",
            body: message,
          };
          break;

        case "sms":
          recipient = user.phone || user.email; // Fallback to email if phone not available
          messageData = {
            body: message,
          };
          break;

        default:
          throw new Error(`Unsupported notification type: ${type}`);
      }

      // Send notification using the created notification object
      const response = await notification.send(recipient, messageData, {
        userId,
        timestamp: new Date().toISOString(),
      });

      console.log(`${type} notification sent successfully:`, response);
      return response;
    } catch (error) {
      console.error("Error sending notification:", error.message);
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  /**
   * Send multiple notifications to a user
   * @param {string} userId - The user's ID
   * @param {string} message - The message to send
   * @param {Array<string>} types - Array of notification types
   */
  async sendMultipleNotifications(userId, message, types = ["push"]) {
    const results = [];
    
    for (const type of types) {
      try {
        const result = await this.sendNotification(userId, message, type);
        results.push({ type, success: true, result });
      } catch (error) {
        results.push({ type, success: false, error: error.message });
      }
    }

    return results;
  }
}

module.exports = NotificationService;
