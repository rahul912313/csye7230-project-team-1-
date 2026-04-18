const UserService = require("../services/userService");
const User = require("../models/user");
const { z } = require("zod");

// Initialize the service with dependency injection
const userService = new UserService(User);

const signupSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),

  // Driver License validation (example format: alphanumeric, 8-15 characters)
  driverLicense: z
    .string()
    .min(6, { message: "Driver license must be at least 6 characters long" })
    .max(15, { message: "Driver license must not exceed 15 characters" })
    .regex(/^[A-Za-z0-9]+$/, {
      message: "Driver license must be alphanumeric",
    }),
});

// Register User
const registerUser = async (req, res) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationResult.error.errors,
      });
    }

    console.log(validationResult.data);

    // Call the service layer to create the user
    const { user, token } = await userService.createUser(validationResult.data);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error registering user:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(1, { message: "Password must be at least 6 characters long" })
    .min(1, { message: "Password is required" }),
});

// Login User
const loginUser = async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationResult.error.errors,
      });
    }

    const { email, password } = validationResult.data;

    const { user, token } = await userService.loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful - Hi from Claude!",
      data: {
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const id = req.userId;

    // Fetch user from the service layer
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const updateUserSchema = signupSchema.partial();

  try {
    const id = req.userId;

    const validationResult = updateUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationResult.error.errors,
      });
    }

    const validatedData = validationResult.data;

    // Call the service layer to update the user
    const updatedUser = await userService.updateUser(id, validatedData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Store Firebase token
const storeFirebaseToken = async (req, res) => {
  const { token } = req.body;

  try {
    const userId = req.userId;

    // Find the user and update the token
    const user = await User.findByIdAndUpdate(
      userId,
      { firebaseToken: token },
      { new: true }
    );

    if (user) {
      res
        .status(200)
        .json({ success: true, message: "Token saved successfully" });
    } else {
      res.status(400).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  storeFirebaseToken,
};
