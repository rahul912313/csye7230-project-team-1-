const express = require("express");
const userRouter = require("./user/user");
const adminRouter = require("./admin/admin");
const chatbotRouter = require("./chatbot");
// const paymentRouter = require("./payment"); // Abbas's scope
// const webhookRouter = require("./webhook"); // Abbas's scope
// const notificationRoutes = require("./notification"); // Abbas's scope

const router = express.Router();

// User routes
router.use("/user", userRouter);

// Admin routes
router.use("/admin", adminRouter);

// Chatbot routes (Rahul's scope)
router.use("/chatbot", chatbotRouter);

// Routes to be implemented by Abbas
// router.use("/notifications", notificationRoutes);
// router.use("/payment", paymentRouter);
// router.use("/webhook", webhookRouter);

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to QuickRent API",
  });
});

module.exports = router;
