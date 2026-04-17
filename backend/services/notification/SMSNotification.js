const Notification = require("./Notification");

/**
 * SMSNotification - Concrete implementation for SMS Notifications
 * Placeholder for future SMS service integration
 */
class SMSNotification extends Notification {
  async send(phoneNumber, message, data) {
    try {
      // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
      console.log(`Sending SMS to ${phoneNumber}`);
      console.log(`Message: ${message.body}`);
      
      // Simulate SMS sending
      return {
        success: true,
        message: "SMS notification sent (simulated)",
        type: "sms",
      };
    } catch (error) {
      console.error("Error sending SMS notification:", error);
      throw new Error(`SMS notification error: ${error.message}`);
    }
  }
}

module.exports = SMSNotification;
