const Notification = require("./Notification");

/**
 * EmailNotification - Concrete implementation for Email Notifications
 * Placeholder for future email service integration
 */
class EmailNotification extends Notification {
  async send(recipient, message, data) {
    try {
      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      console.log(`Sending email to ${recipient}`);
      console.log(`Subject: ${message.title}`);
      console.log(`Body: ${message.body}`);
      
      // Simulate email sending
      return {
        success: true,
        message: "Email notification sent (simulated)",
        type: "email",
      };
    } catch (error) {
      console.error("Error sending email notification:", error);
      throw new Error(`Email notification error: ${error.message}`);
    }
  }
}

module.exports = EmailNotification;
