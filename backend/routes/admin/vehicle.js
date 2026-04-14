const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer");
const {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  removeVehicle,
} = require("../../controllers/vehicleController");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

// Admin routes

// Add a new vehicle (Admin only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.array("images", 5),

  addVehicle
);

// Get all vehicles (Admin can see all vehicles)
router.get("/", authMiddleware, roleMiddleware("admin"), getAllVehicles);

// Get vehicle by ID (Admin can view vehicle details)
router.get("/:id", authMiddleware, roleMiddleware("admin"), getVehicleById);

// Update vehicle by ID (Admin can update vehicle details)
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateVehicle);

// Delete vehicle by ID (Admin can delete vehicles)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), removeVehicle);

module.exports = router;
