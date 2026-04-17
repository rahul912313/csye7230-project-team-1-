const NotificationFactory = require('../services/notification/NotificationFactory');
const PushNotification = require('../services/notification/PushNotification');
const EmailNotification = require('../services/notification/EmailNotification');
const SMSNotification = require('../services/notification/SMSNotification');

describe('NotificationFactory - Factory Pattern', () => {
  it('should create PushNotification instance', () => {
    const notification = NotificationFactory.createNotification('push');
    expect(notification).toBeInstanceOf(PushNotification);
  });

  it('should create EmailNotification instance', () => {
    const notification = NotificationFactory.createNotification('email');
    expect(notification).toBeInstanceOf(EmailNotification);
  });

  it('should create SMSNotification instance', () => {
    const notification = NotificationFactory.createNotification('sms');
    expect(notification).toBeInstanceOf(SMSNotification);
  });

  it('should throw error for unknown notification type', () => {
    expect(() => {
      NotificationFactory.createNotification('unknown');
    }).toThrow('Unknown notification type: unknown');
  });

  it('should return available notification types', () => {
    const types = NotificationFactory.getAvailableTypes();
    expect(types).toEqual(['push', 'email', 'sms']);
  });
});
