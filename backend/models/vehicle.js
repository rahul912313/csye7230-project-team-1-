const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  Vehicletype: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  licensePlate: {
    type: String,
    unique: true, // Ensure license plate is unique
    required: true,
  },
  images: [
    {
      type: String, // Array of image URLs/paths
      default: [],
    },
  ],
  location: {
    address: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    zipCode: {
      type: String,
      default: "",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
