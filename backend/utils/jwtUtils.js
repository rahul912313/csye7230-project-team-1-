const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config/.env" });

/**
 * JWT Token Utility Functions for QuickRent
 * Handles token generation and verification
 */

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

/**
 * Generate JWT token for user
 * @param {Object} payload - User data to encode in token
 * @param {String} payload.userId - User ID
 * @param {String} payload.email - User email
 * @param {String} payload.role - User role
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  try {
    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE,
      }
    );
    return token;
  } catch (error) {
    throw new Error(`Error generating token: ${error.message}`);
  }
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

/**
 * Generate refresh token (longer expiry)
 * @param {Object} payload - User data
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
      },
      JWT_SECRET,
      {
        expiresIn: "30d", // Refresh token valid for 30 days
      }
    );
    return token;
  } catch (error) {
    throw new Error(`Error generating refresh token: ${error.message}`);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
};
