const express = require("express");
const userRouter = require("./user/user");
const adminRouter = require("./admin/admin");
// const paymentRouter = require("./payment"); // Abbas's scope
// const webhookRouter = require("./webhook"); // Abbas's scope
// const notificationRoutes = require("./notification"); // Abbas's scope
// const chatbotRouter = require("./chatbot"); // Abbas's scope

const router = express.Router();

// User routes
router.use("/user", userRouter);

// Admin routes
router.use("/admin", adminRouter);

// Routes to be implemented by Abbas
// router.use("/notifications", notificationRoutes);
// router.use("/payment", paymentRouter);
// router.use("/webhook", webhookRouter);
// router.use("/chatbot", chatbotRouter);

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to QuickRent API",
  });
});

module.exports = router;
