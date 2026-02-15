require("dotenv").config({ path: "./config/.env" });
const mongoose = require("mongoose");

/**
 * DatabaseConnection - Singleton Pattern Implementation
 * Ensures only one database connection instance exists throughout the application lifecycle
 *
 * Design Pattern: Singleton
 * Purpose: Manage database connection as a single shared resource
 * 
 * QuickRent Vehicle Rental Platform
 */
class DatabaseConnection {
  constructor() {
    // If instance already exists, return it (Singleton guarantee)
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    // Initialize connection state
    this.connection = null;
    this.isConnecting = false;

    // Store the instance
    DatabaseConnection.instance = this;
  }

  /**
   * Connect to MongoDB database
   * @returns {Promise<mongoose.Connection>} The mongoose connection object
   */
  async connect() {
    // If already connected, return existing connection
    if (this.connection) {
      console.log("Database already connected, reusing existing connection");
      return this.connection;
    }

    // If connection is in progress, wait for it
    if (this.isConnecting) {
      console.log("Connection in progress, waiting...");
      return this.waitForConnection();
    }

    try {
      this.isConnecting = true;
      console.log("Establishing new database connection...");

      await mongoose.connect(process.env.MONGO_URI, {
        // Connection options for better reliability
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.connection = mongoose.connection;
      this.isConnecting = false;

      console.log("✅ Connected to MongoDB successfully (QuickRent)");

      // Handle connection events
      this.setupEventHandlers();

      return this.connection;
    } catch (error) {
      this.isConnecting = false;
      console.error("❌ Error connecting to MongoDB:", error.message);
      process.exit(1);
    }
  }

  /**
   * Wait for an ongoing connection attempt to complete
   * @returns {Promise<mongoose.Connection>}
   */
  async waitForConnection() {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (this.connection) {
          clearInterval(checkInterval);
          resolve(this.connection);
        } else if (!this.isConnecting) {
          clearInterval(checkInterval);
          reject(new Error("Connection failed"));
        }
      }, 100);
    });
  }

  /**
   * Get the current database connection
   * @returns {mongoose.Connection} The active connection
   * @throws {Error} If database is not connected
   */
  getConnection() {
    if (!this.connection) {
      throw new Error("Database not connected. Please call connect() first.");
    }
    return this.connection;
  }

  /**
   * Check if database is currently connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.connection !== null && mongoose.connection.readyState === 1;
  }

  /**
   * Setup event handlers for connection lifecycle
   */
  setupEventHandlers() {
    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
      this.connection = null;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
      this.connection = mongoose.connection;
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Disconnect from the database
   */
  async disconnect() {
    if (this.connection) {
      await mongoose.connection.close();
      this.connection = null;
      console.log("Database connection closed");
    }
  }

  /**
   * Get connection statistics
   * @returns {Object} Connection stats
   */
  getStats() {
    if (!this.connection) {
      return { connected: false };
    }

    return {
      connected: this.isConnected(),
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };
  }
}

// Create the singleton instance
const dbInstance = new DatabaseConnection();

// Export the singleton instance
module.exports = dbInstance;

/**
 * Usage Examples:
 *
 * // In index.js or app.js:
 * const db = require('./db');
 * await db.connect();
 *
 * // In any other file:
 * const db = require('./db');
 * const connection = db.getConnection();
 *
 * // Check connection status:
 * if (db.isConnected()) {
 *   console.log('Database is connected');
 * }
 *
 * // Get stats:
 * console.log(db.getStats());
 */
