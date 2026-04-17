const { z } = require("zod");
const BookingService = require("../services/bookingService");
const Booking = require("../models/booking");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const BookingRequest = require("../models/bookingRequest");
const { Types } = require("mongoose");

// Initialize the service with dependency injection
const bookingService = new BookingService(Booking, User, Vehicle, BookingRequest);

// Booking validation using zod
const bookingSchema = z
  .object({
    user: z
      .string()
      .refine((id) => Types.ObjectId.isValid(id), {
        message: "Invalid User ID format",
      })
      .optional(),
    vehicle: z.string().refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid Vehicle ID format",
    }),
    startDate: z.union([
      z.date(),
      z.string().transform((val) => new Date(val)),
    ]),
    endDate: z.union([z.date(), z.string().transform((val) => new Date(val))]),
    status: z.enum(["pending", "confirmed", "canceled"]).optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      return endDate > startDate;
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"], // Point the error to the endDate field
    }
  );

// Endpoint to create booking
const createBooking = async (req, res) => {
  try {
    // Validating data
    const validatedData = bookingSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validatedData.error.errors,
      });
    }

    const user = req.userId;

    // Destructuring
    const { vehicle, startDate, endDate, status } = validatedData.data;

    // Debugging: Log the incoming data
    console.log("Incoming Booking Data:", validatedData.data);

    // Checking if the booking conflicts with the existing ones
    const conflictingBooking = await bookingService.checkConflictingBooking(
      vehicle,
      startDate,
      endDate
    );

    // Debugging: Log the conflicting booking
    console.log("Conflicting Booking:", conflictingBooking);

    if (conflictingBooking) {
      return res.status(400).json({
        message: "Vehicle is already booked for the selected period",
      });
    }

    const booking = await bookingService.createBooking({
      user,
      vehicle,
      startDate,
      endDate,
      status,
    });

    // NOTE: Payment is handled separately via POST /api/v1/payment
    // Future Enhancement: Implement booking request/confirm pattern
    // for atomic booking+payment operation to prevent orphan bookings
    // See: https://stripe.com/docs/payments/accept-a-payment

    res.status(200).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (e) {
    console.error("Error creating booking:", e.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    // Getting the booking id from the params
    const id = req.params.id.trim();
    // console.log(id);

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Booking ID format" });
    }

    // calling the service layer
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking retrieved successfully",
      booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Updating booking
const updateBooking = async (req, res) => {
  const updateBodySchema = z
    .object({
      user: z
        .string()
        .optional()
        .refine((id) => !id || Types.ObjectId.isValid(id), {
          message: "Invalid User ID format",
        }),
      vehicle: z
        .string()
        .optional()
        .refine((id) => !id || Types.ObjectId.isValid(id), {
          message: "Invalid Vehicle ID format",
        }),
      startDate: z
        .union([z.date(), z.string().transform((val) => new Date(val))])
        .optional(),
      endDate: z
        .union([z.date(), z.string().transform((val) => new Date(val))])
        .optional(),
      status: z.enum(["pending", "confirmed", "canceled"]).optional(),
    })
    .refine(
      (data) => {
        // Checking if the start date is before end and vice versa
        if (data.startDate && data.endDate) {
          const startDate = new Date(data.startDate);
          const endDate = new Date(data.endDate);
          return endDate > startDate;
        }
        return true; // Skip if one of the dates is missing
      },
      {
        message: "End date must be after the start date",
        path: ["endDate"],
      }
    );

  try {
    const bookingId = req.params.id.trim();

    if (!Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid Booking ID format" });
    }

    const validatedData = updateBodySchema.safeParse(req.body);
    // console.log(validatedData);
    if (!validatedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validatedData.error.errors,
      });
    }

    // Fetch the existing booking from the database
    const existingBooking = await bookingService.getBookingById(bookingId);

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      existingBooking.user.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this booking",
      });
    }

    // Validate startDate against the existing endDate if present
    if (
      validatedData.data.startDate &&
      existingBooking.endDate &&
      new Date(validatedData.data.startDate) >=
        new Date(existingBooking.endDate)
    ) {
      return res.status(400).json({
        message: "Start date must be earlier than the existing end date",
      });
    }

    console.log(validatedData.data.startDate, existingBooking.endDate);

    const updatedBooking = await bookingService.updateBooking(
      bookingId,
      validatedData.data
    );

    if (!updatedBooking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking updated",
      updatedBooking,
    });
  } catch (e) {
    console.error("Error updating booking:", e);
    res.status(500).json({
      message: "Internal server error",
      error: e.message,
    });
  }
};

const getAllUserBookings = async (req, res) => {
  try {
    // getting the userId from the middle ware
    const userId = req.userId;
    const userBookings = await bookingService.getUserBooking(userId);
    if (!userBookings) {
      return res.status(404).json({
        message: "No Bookings found for the user",
      });
    }

    res.status(200).json({
      message: "Bookings fetched sucessfully",
      userBookings,
    });
  } catch (e) {
    console.error("Error fetching bookings : ", e.message);

    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

// Updating status to cancel
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id.trim();

    if (!Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid Booking ID format" });
    }

    const booking = await bookingService.cancelBooking(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking Cancelled",
      booking,
    });
  } catch (e) {
    console.error("Error canceling booking:", e.message);

    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getAllBookingsOfAllUsers = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    console.log(bookings);
    if (!bookings) {
      return res.status(404).json({
        message: "No Booking Founds",
      });
    }

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (e) {
    console.error("Error fetching all bookings:", e.message);

    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

const getBookingsOfUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const bookings = await bookingService.getBookingsOfUser(userId);
    if (!bookings) {
      return res.status(404).json({
        message: "No Booking Founds",
      });
    }

    res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (e) {
    console.error("Error fetching all bookings:", e.message);

    res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

// NEW: Request Booking (Phase 1)
const requestBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({
        message: "vehicleId, startDate, and endDate are required",
      });
    }

    const result = await bookingService.requestBooking(
      userId,
      vehicleId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      message: "Booking request created successfully",
      data: result,
    });
  } catch (e) {
    console.error("Error requesting booking:", e.message);
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

// NEW: Confirm Booking with Payment (Phase 2)
const confirmBookingWithPayment = async (req, res) => {
  try {
    const { requestToken, paymentMethodId } = req.body;

    if (!requestToken) {
      return res.status(400).json({
        message: "requestToken is required",
      });
    }

    // Step 1: Confirm booking (creates booking record)
    const { booking, priceQuote } = await bookingService.confirmBooking(requestToken);

    // Step 2: Create payment intent (imported from paymentService)
    const { createPaymentIntent } = require("../services/paymentService");
    const { paymentIntent, transaction } = await createPaymentIntent(
      priceQuote,
      "usd",
      booking.user,
      booking._id
    );

    res.status(201).json({
      success: true,
      message: "Booking confirmed. Complete payment to finalize.",
      data: {
        booking,
        clientSecret: paymentIntent.clientSecret,
        transactionId: transaction._id,
        amount: priceQuote,
      },
    });
  } catch (e) {
    console.error("Error confirming booking:", e.message);
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  updateBooking,
  cancelBooking,
  getAllUserBookings,
  getAllBookingsOfAllUsers,
  getBookingsOfUser,
  requestBooking,
  confirmBookingWithPayment,
};
