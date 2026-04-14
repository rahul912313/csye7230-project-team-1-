require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const rootRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration (allow frontend)
const corsOptions = {
  origin: ["http://localhost:3002", "http://localhost:5175", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

// Webhook raw body parser middleware
app.use("/api/v1/webhook", bodyParser.raw({ type: "application/json" }));

// Parse JSON request bodies
app.use(express.json());

// Connect to the database using Singleton pattern
db.connect();

// Mount the routes
app.use("/api/v1", rootRouter);

// Start the server
app
  .listen(PORT, () => {
    console.log(`The server is running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });
