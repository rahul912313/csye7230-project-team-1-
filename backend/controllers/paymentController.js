const { createPaymentIntent } = require("../services/paymentService");

const createPayment = async (req, res) => {
  const { amount, currency, userId, bookingId } = req.body;
  console.log("Creating payment");

  try {
    // Call the service to create a payment intent and save the transaction
    const { paymentIntent, transaction } = await createPaymentIntent(
      amount,
      currency,
      userId,
      bookingId
    );

    console.log("Payment intent creation successfull");

    // Send the client secret back to the frontend for confirmation
    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id, // Send the new transaction ID to the frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment };
