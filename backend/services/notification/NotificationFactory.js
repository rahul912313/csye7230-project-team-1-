const PushNotification = require("./PushNotification");
const EmailNotification = require("./EmailNotification");
const SMSNotification = require("./SMSNotification");

/**
 * NotificationFactory - Factory Pattern Implementation
 * Creates different types of notification objects based on type
 * 
 * Design Pattern: Factory
 * Purpose: Encapsulate object creation logic and provide flexibility
 */
class NotificationFactory {
  /**
   * Create a notification instance based on type
   * @param {string} type - Type of notification ('push', 'email', 'sms')
   * @returns {Notification} Instance of the requested notification type
   */
  static createNotification(type) {
    switch (type.toLowerCase()) {
      case "push":
        return new PushNotification();
      case "email":
        return new EmailNotification();
      case "sms":
        return new SMSNotification();
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }

  /**
   * Get all available notification types
   * @returns {Array<string>} List of supported notification types
   */
  static getAvailableTypes() {
    return ["push", "email", "sms"];
  }
}

module.exports = NotificationFactory;
