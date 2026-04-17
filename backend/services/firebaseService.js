const admin = require("../utils/firebaseAdmin");

const messaging = admin.messaging();

// Function to send push notification
const sendNotification = async (token, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await messaging.send(message);
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new Error(error);
  }
};

module.exports = {
  sendNotification,
};
