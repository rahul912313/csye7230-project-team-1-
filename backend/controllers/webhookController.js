const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { handleStripeWebhookEvent } = require("../services/webhookService");

const handleStripeWebhook = async (req, res) => {
  console.log("Im inside webhooks");
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verifying the Stripe webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log("Webhooks verification done");
    // console.log(event);
  } catch (err) {
    console.error("Webhook error: ", err);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  try {
    // Call the service to handle the webhook event
    const transaction = await handleStripeWebhookEvent(event);
    console.log("webhook ->", transaction);

    // Respond with a 200 status to acknowledge receipt of the event
    res.status(200).json({ received: true, transaction });
  } catch (err) {
    console.error("Error processing webhook event:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { handleStripeWebhook };
