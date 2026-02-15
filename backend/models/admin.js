const mongoose = require("mongoose");

/**
 * Admin Model for QuickRent
 * Represents an administrator with elevated permissions
 */
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true, // Index for faster queries
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "super_admin"], // Different admin levels
  },
  permissions: {
    type: [String],
    default: ["read", "write", "delete"],
    enum: ["read", "write", "delete", "manage_users", "manage_vehicles", "view_analytics"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
adminSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Admin", adminSchema);
