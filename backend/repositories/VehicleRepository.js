const BaseRepository = require("./BaseRepository");

/**
 * VehicleRepository - Repository for Vehicle-specific database operations
 * Extends BaseRepository with Vehicle-specific methods
 */
class VehicleRepository extends BaseRepository {
  constructor(vehicleModel) {
    super(vehicleModel);
  }

  async findByLicensePlate(licensePlate) {
    try {
      return await this.model.findOne({ licensePlate });
    } catch (error) {
      throw new Error(`Error finding vehicle by license plate: ${error.message}`);
    }
  }

  async findAvailable() {
    try {
      return await this.model.find({ availability: true });
    } catch (error) {
      throw new Error(`Error finding available vehicles: ${error.message}`);
    }
  }

  async findByType(vehicleType) {
    try {
      return await this.model.find({ Vehicletype: vehicleType });
    } catch (error) {
      throw new Error(`Error finding vehicles by type: ${error.message}`);
    }
  }

  async findByPriceRange(minPrice, maxPrice) {
    try {
      return await this.model.find({
        pricePerDay: { $gte: minPrice, $lte: maxPrice }
      });
    } catch (error) {
      throw new Error(`Error finding vehicles by price range: ${error.message}`);
    }
  }

  async updateAvailability(vehicleId, availability) {
    try {
      return await this.model.findByIdAndUpdate(
        vehicleId,
        { availability },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating vehicle availability: ${error.message}`);
    }
  }

  async findByLocation(latitude, longitude, radiusInKm = 10) {
    try {
      // Calculate bounding box for the search radius
      const earthRadiusKm = 6371;
      const latDelta = (radiusInKm / earthRadiusKm) * (180 / Math.PI);
      const lonDelta = (radiusInKm / (earthRadiusKm * Math.cos((latitude * Math.PI) / 180))) * (180 / Math.PI);

      return await this.model.find({
        'location.latitude': {
          $gte: latitude - latDelta,
          $lte: latitude + latDelta,
        },
        'location.longitude': {
          $gte: longitude - lonDelta,
          $lte: longitude + lonDelta,
        },
        availability: true,
      });
    } catch (error) {
      throw new Error(`Error finding vehicles by location: ${error.message}`);
    }
  }

  async findByCity(city) {
    try {
      return await this.model.find({ 'location.city': city });
    } catch (error) {
      throw new Error(`Error finding vehicles by city: ${error.message}`);
    }
  }
}

module.exports = VehicleRepository;
