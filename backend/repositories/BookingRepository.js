const BaseRepository = require("./BaseRepository");

/**
 * BookingRepository - Repository for Booking-specific database operations
 * Extends BaseRepository with Booking-specific methods
 */
class BookingRepository extends BaseRepository {
  constructor(bookingModel) {
    super(bookingModel);
  }

  async findByUserId(userId) {
    try {
      return await this.model.find({ user: userId });
    } catch (error) {
      throw new Error(`Error finding bookings by user ID: ${error.message}`);
    }
  }

  async findByVehicleId(vehicleId) {
    try {
      return await this.model.find({ vehicle: vehicleId });
    } catch (error) {
      throw new Error(`Error finding bookings by vehicle ID: ${error.message}`);
    }
  }

  async findByStatus(status) {
    try {
      return await this.model.find({ status });
    } catch (error) {
      throw new Error(`Error finding bookings by status: ${error.message}`);
    }
  }

  async findConflicting(vehicleId, startDate, endDate) {
    try {
      return await this.model.findOne({
        vehicle: vehicleId,
        $or: [
          { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
        ],
      });
    } catch (error) {
      throw new Error(`Error finding conflicting bookings: ${error.message}`);
    }
  }

  async updateStatus(bookingId, status) {
    try {
      return await this.model.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating booking status: ${error.message}`);
    }
  }

  async findUpcoming(userId) {
    try {
      return await this.model.find({
        user: userId,
        startDate: { $gte: new Date() },
        status: { $ne: "canceled" }
      }).sort({ startDate: 1 });
    } catch (error) {
      throw new Error(`Error finding upcoming bookings: ${error.message}`);
    }
  }
}

module.exports = BookingRepository;
