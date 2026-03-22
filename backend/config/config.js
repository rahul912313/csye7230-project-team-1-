/**
 * Configuration Helper for QuickRent
 * Manages environment-specific settings
 */

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Database
  mongoUri: process.env.MONGO_URI,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  
  // Frontend
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  
  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  uploadPath: process.env.UPLOAD_PATH || "./uploads",
  
  // Pagination
  defaultPageSize: 10,
  maxPageSize: 100,
  
  // Rate Limiting (for future implementation)
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100,
  
  // Security
  bcryptSaltRounds: 10,
  
  // Logging
  enableDetailedLogs: process.env.NODE_ENV === "development",
  
  // CORS
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:3000"],
};

/**
 * Validate required environment variables
 * @throws {Error} If required variables are missing
 */
const validateConfig = () => {
  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

/**
 * Check if running in production
 * @returns {Boolean}
 */
const isProduction = () => {
  return config.nodeEnv === "production";
};

/**
 * Check if running in development
 * @returns {Boolean}
 */
const isDevelopment = () => {
  return config.nodeEnv === "development";
};

module.exports = {
  config,
  validateConfig,
  isProduction,
  isDevelopment,
};
