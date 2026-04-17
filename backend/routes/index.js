const express = require("express");
const userRouter = require("./user/user");
const adminRouter = require("./admin/admin");
const paymentRouter = require("./payment");
const webhookRouter = require("./webhook");
const notificationRoutes = require("./notification");
const chatbotRouter = require("./chatbot");

const router = express.Router();

// router.use("/user", userRouter);
// router.use("/booking", bookingRouter);
// router.use("/admin", adminRouter);
// router.use("/vehicle", vehicleRouter);

// User routes
router.use("/user", userRouter);

// Admin routes
router.use("/admin", adminRouter);

// Fugu route
router.use("/notifications", notificationRoutes);

//Routes for payment and webhook
router.use("/payment", paymentRouter);
router.use("/webhook", webhookRouter);

// Chatbot route
router.use("/chatbot", chatbotRouter);

router.get("/", (req, res) => {
  res.json({
    message: "Hello im in rootRouter",
  });
});

module.exports = router;
