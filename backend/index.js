require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const rootRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://quickrent-seven.vercel.app',
    'https://quickrent-dpw3zn9a8-rahulptl556s-projects.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to QuickRent API',
    version: '1.0.0',
    status: 'Server is running'
  });
});


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
