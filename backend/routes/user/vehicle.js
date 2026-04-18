const express = require("express");
const router = express.Router();

const {
  getAllVehicles,
  getVehicleById,
  getAvailableVehiclesController,
  getVehiclesByLocation,
} = require("../../controllers/vehicleController");
const authMiddleware = require("../../middlewares/authMiddleware");

// Get all vehicles (read-only for users)
router.get("/", authMiddleware, getAllVehicles);

// Get vehicles by location (nearby) - MUST be before /:id
router.get("/nearby", authMiddleware, getVehiclesByLocation);

// Get available vehicles for a specific date range
router.get(
  "/available/:startDate/:endDate",
  authMiddleware,
  getAvailableVehiclesController
);

// Get by ID (view vehicle details) - MUST be last
router.get("/:id", authMiddleware, getVehicleById);

module.exports = router;
