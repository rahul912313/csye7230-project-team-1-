/**
 * Notification - Abstract Base Class
 * Defines the interface for all notification types
 */
class Notification {
  async send(recipient, message, data) {
    throw new Error("send() must be implemented by subclass");
  }
}

module.exports = Notification;
