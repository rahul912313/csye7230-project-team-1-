const z = require("zod");
const VehicleService = require("../services/vehicleService");
const Vehicle = require("../models/vehicle");
const Booking = require("../models/booking");

// Initialize the service with dependency injection
const vehicleService = new VehicleService(Vehicle, Booking);

// Zod schema for vehicle validation
const vehicleSchema = z.object({
  Vehicletype: z
    .string()
    .trim()
    .min(1, { message: "Vehicle type is required." }),
  model: z.string().trim().min(1, { message: "Model is required." }),
  pricePerDay: z
    .number()
    .positive({ message: "Price per day must be a positive number." }),
  capacity: z
    .number()
    .positive({ message: "Capacity must be a positive number." }),
  availability: z.boolean().optional(),
  licensePlate: z
    .string()
    .trim()
    .regex(/^[A-Z0-9-]{1,10}$/, { message: "Invalid license plate format." })
    .min(1, { message: "License plate is required." }),
  location: z.object({
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

// Add a new vehicle
const addVehicle = async (req, res) => {
  try {
    console.log(req.files);
    console.log("Request body:", req.body);
    
    // Parse and convert `form-data` fields to expected types
    req.body.pricePerDay = parseFloat(req.body.pricePerDay);
    req.body.capacity = parseInt(req.body.capacity);
    req.body.availability = req.body.availability === "true";

    // Parse location object (convert string numbers to actual numbers)
    if (req.body.location) {
      if (req.body.location.latitude) {
        req.body.location.latitude = parseFloat(req.body.location.latitude);
      }
      if (req.body.location.longitude) {
        req.body.location.longitude = parseFloat(req.body.location.longitude);
      }
    }

    // Validate the incoming request body
    const validatedData = vehicleSchema.parse(req.body);

    // Process uploaded images from Multer (handled in the route)
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    console.log(imageUrls);
    // Add image URLs to the validated data
    validatedData.images = imageUrls;

    // Save vehicle details in the database
    const result = await vehicleService.addVehicle(validatedData);

    // Respond with success
    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    } else {
      // Handle other server-side errors
      res.status(500).json({
        message: "Server error while adding vehicle",
        error: error.message,
      });
    }
  }
};

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json({ message: "List of all vehicles", vehicles });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching vehicles",
      error: error.message,
    });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: `Vehicle details for ID ${id}`, vehicle });
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching vehicle",
      error: error.message,
    });
  }
};

// Update vehicle by ID
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate request body
    const validatedData = vehicleSchema.partial().parse(req.body);
    const updatedVehicle = await vehicleService.updateVehicle(
      id,
      validatedData
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res.status(500).json({
        message: "Server error while updating vehicle",
        error: error.message,
      });
    }
  }
};

// Remove vehicle by ID
const removeVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicle = await vehicleService.removeVehicle(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({
      message: "Vehicle removed successfully",
      vehicle: deletedVehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while removing vehicle",
      error: error.message,
    });
  }
};

const getAvailableVehiclesController = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    const availableVehicles = await vehicleService.getAvailableVehicles(
      startDate,
      endDate
    );

    res.status(200).json({
      message: "Available vehicles retrieved successfully",
      availableVehicles,
    });
  } catch (e) {
    console.error("Error fetching available vehicles:", e.message);
    res.status(500).json({
      message: "Server error while fetching vehicle",
      error: e.message,
    });
  }
};

// Get vehicles by location (near user)
const getVehiclesByLocation = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const radiusInKm = radius ? parseFloat(radius) : 10; // Default 10km

    if (isNaN(lat) || isNaN(lon) || isNaN(radiusInKm)) {
      return res.status(400).json({
        message: "Invalid latitude, longitude, or radius",
      });
    }

    const vehicles = await vehicleService.getVehiclesByLocation(
      lat,
      lon,
      radiusInKm
    );

    res.status(200).json({
      message: "Vehicles near you",
      count: vehicles.length,
      searchRadius: `${radiusInKm} km`,
      vehicles,
    });
  } catch (error) {
    console.error("Error finding vehicles by location:", error.message);
    res.status(500).json({
      message: "Server error while finding vehicles",
      error: error.message,
    });
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  removeVehicle,
  getAvailableVehiclesController,
  getVehiclesByLocation,
};
