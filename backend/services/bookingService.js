/**
 * BookingService - Service Layer for Booking Management
 * Implements business logic for booking operations
 * Uses Dependency Injection for better testability and modularity
 */
const crypto = require('crypto');

class BookingService {
  constructor(bookingModel, userModel, vehicleModel, bookingRequestModel) {
    this.bookingModel = bookingModel;
    this.userModel = userModel;
    this.vehicleModel = vehicleModel;
    this.bookingRequestModel = bookingRequestModel;
  }

  async createBooking(data) {
    try {
      // Check if the user exists
      const existingUser = await this.userModel.findById(data.user);
      if (!existingUser) {
        throw new Error("User not found");
      }

      // Check if the vehicle exists
      const existingVehicle = await this.vehicleModel.findById(data.vehicle);
      if (!existingVehicle) {
        throw new Error("Vehicle not found");
      }

      // Create the booking
      const savedBooking = await this.bookingModel.create(data);
      return savedBooking;
    } catch (e) {
      console.error("Error creating booking:", e.message);
      throw new Error(`Error creating booking: ${e.message}`);
    }
  }

  async updateBooking(bookingId, data) {
    try {
      const booking = await this.bookingModel.findOneAndUpdate(
        { _id: bookingId },
        { ...data },
        { new: true }
      );
      return booking;
    } catch (e) {
      console.error("Error updating booking details", e.message);
      throw new Error("Error updating booking details");
    }
  }

  async getBookingById(id) {
    try {
      return await this.bookingModel.findById(id);
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw new Error("Error fetching booking");
    }
  }

  async getUserBooking(userId) {
    try {
      const userBookings = await this.bookingModel.find({ user: userId });
      return userBookings;
    } catch (e) {
      console.error("Error fetching booking in DB:", e.message);
      throw new Error("Error fetching booking in the database");
    }
  }

  async cancelBooking(bookingId) {
    try {
      const booking = await this.bookingModel.findOneAndUpdate(
        { _id: bookingId },
        { status: "canceled" },
        { new: true }
      );

      return booking;
    } catch (error) {
      console.error("Error canceling booking in DB:", error.message);
      throw new Error("Error canceling booking in the database");
    }
  }

  async checkConflictingBooking(vehicleId, startDate, endDate) {
    try {
      // NOTE: Checking both 'pending' and 'confirmed' statuses
      // to prevent race conditions during payment processing
      const conflictingBooking = await this.bookingModel.findOne({
        vehicle: vehicleId,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          { startDate: { $lt: endDate }, endDate: { $gt: startDate } }, // Overlapping booking
        ],
      });

      return conflictingBooking;
    } catch (error) {
      console.error("Error checking conflicting booking:", error.message);
      throw new Error("Error checking for conflicting booking.");
    }
  }

  async getAllBookings() {
    try {
      const bookings = await this.bookingModel.find();
      return bookings;
    } catch (e) {
      console.error("Error fetching booking from DB:", e.message);
      throw new Error("Error fetching bookings from the database");
    }
  }

  async getBookingsOfUser(userId) {
    try {
      const bookings = await this.bookingModel.find({ user: userId });
      return bookings;
    } catch (e) {
      console.error("Error fetching booking from DB:", e.message);
      throw new Error("Error fetching bookings from the database");
    }
  }

  /**
   * REQUEST BOOKING - Phase 1 (No DB write, just validation)
   * Creates temporary lock and returns quote
   */
  async requestBooking(userId, vehicleId, startDate, endDate) {
    try {
      // Check if user exists
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if vehicle exists
      const vehicle = await this.vehicleModel.findById(vehicleId);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      // Check for conflicts (including pending and active requests)
      const conflictingBooking = await this.checkConflictingBooking(
        vehicleId,
        startDate,
        endDate
      );

      if (conflictingBooking) {
        throw new Error("Vehicle is already booked for the selected period");
      }

      // Check for active booking requests (temporary locks)
      const conflictingRequest = await this.bookingRequestModel.findOne({
        vehicle: vehicleId,
        status: "active",
        expiresAt: { $gt: new Date() },
        $or: [
          { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
        ],
      });

      if (conflictingRequest) {
        throw new Error(
          "Vehicle is temporarily locked by another user. Please try again in a few minutes."
        );
      }

      // Calculate price
      const days = Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      );
      const priceQuote = vehicle.pricePerDay * days;

      // Generate unique request token
      const requestToken = crypto.randomBytes(32).toString('hex');

      // Create booking request (temporary lock for 15 minutes)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      const bookingRequest = await this.bookingRequestModel.create({
        requestToken,
        user: userId,
        vehicle: vehicleId,
        startDate,
        endDate,
        priceQuote,
        expiresAt,
        status: "active",
      });

      return {
        requestToken,
        priceQuote,
        days,
        vehicle: {
          id: vehicle._id,
          model: vehicle.model,
          type: vehicle.Vehicletype,
          pricePerDay: vehicle.pricePerDay,
        },
        validUntil: expiresAt,
        message: "Booking request created. Complete payment within 15 minutes.",
      };
    } catch (e) {
      console.error("Error requesting booking:", e.message);
      throw new Error(`Error requesting booking: ${e.message}`);
    }
  }

  /**
   * CONFIRM BOOKING - Phase 2 (Atomic with payment)
   * Verifies request token and creates actual booking
   */
  async confirmBooking(requestToken) {
    try {
      // Find and validate booking request
      const bookingRequest = await this.bookingRequestModel.findOne({
        requestToken,
        status: "active",
      });

      if (!bookingRequest) {
        throw new Error("Invalid or expired booking request");
      }

      // Check if expired
      if (new Date() > bookingRequest.expiresAt) {
        await this.bookingRequestModel.findByIdAndUpdate(bookingRequest._id, {
          status: "expired",
        });
        throw new Error("Booking request has expired. Please create a new request.");
      }

      // Re-check conflicts (double-check for safety)
      const conflictingBooking = await this.checkConflictingBooking(
        bookingRequest.vehicle,
        bookingRequest.startDate,
        bookingRequest.endDate
      );

      if (conflictingBooking) {
        await this.bookingRequestModel.findByIdAndUpdate(bookingRequest._id, {
          status: "canceled",
        });
        throw new Error(
          "Vehicle became unavailable. Booking request canceled."
        );
      }

      // Create actual booking
      const booking = await this.bookingModel.create({
        user: bookingRequest.user,
        vehicle: bookingRequest.vehicle,
        startDate: bookingRequest.startDate,
        endDate: bookingRequest.endDate,
        status: "pending", // Will be updated to 'confirmed' after payment
      });

      // Mark booking request as confirmed
      await this.bookingRequestModel.findByIdAndUpdate(bookingRequest._id, {
        status: "confirmed",
      });

      return {
        booking,
        priceQuote: bookingRequest.priceQuote,
      };
    } catch (e) {
      console.error("Error confirming booking:", e.message);
      throw new Error(`Error confirming booking: ${e.message}`);
    }
  }
}

module.exports = BookingService;
