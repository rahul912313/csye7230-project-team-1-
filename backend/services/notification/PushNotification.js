const Notification = require("./Notification");
const admin = require("../../utils/firebaseAdmin");

/**
 * PushNotification - Concrete implementation for Push Notifications
 * Uses Firebase Cloud Messaging (FCM)
 */
class PushNotification extends Notification {
  constructor() {
    super();
    this.messaging = admin.messaging();
  }

  async send(token, message, data) {
    const payload = {
      notification: {
        title: message.title || "Notification",
        body: message.body || "",
      },
      token,
      data: data || {},
    };

    try {
      const response = await this.messaging.send(payload);
      console.log("Push notification sent successfully:", response);
      return {
        success: true,
        response,
        type: "push",
      };
    } catch (error) {
      console.error("Error sending push notification:", error);
      throw new Error(`Push notification error: ${error.message}`);
    }
  }
}

module.exports = PushNotification;
