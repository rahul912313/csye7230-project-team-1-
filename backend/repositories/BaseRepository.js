/**
 * BaseRepository - Abstract base class for all repositories
 * Implements common CRUD operations
 *
 * Design Pattern: Repository Pattern
 * Purpose: Abstract data access logic and provide a collection-like interface
 *
 * QuickRent Vehicle Rental Platform
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(filter = {}, options = {}) {
    try {
      return await this.model.find(filter, null, options);
    } catch (error) {
      throw new Error(`Error finding all: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error finding by ID: ${error.message}`);
    }
  }

  async findOne(filter) {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      throw new Error(`Error finding one: ${error.message}`);
    }
  }

  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating: ${error.message}`);
    }
  }

  async update(id, data, options = { new: true, runValidators: true }) {
    try {
      return await this.model.findByIdAndUpdate(id, data, options);
    } catch (error) {
      throw new Error(`Error updating: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting: ${error.message}`);
    }
  }

  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting: ${error.message}`);
    }
  }

  async exists(filter) {
    try {
      const doc = await this.model.findOne(filter).select('_id');
      return !!doc;
    } catch (error) {
      throw new Error(`Error checking existence: ${error.message}`);
    }
  }

  async softDelete(id) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error soft deleting: ${error.message}`);
    }
  }

  async restore(id) {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        { isDeleted: false, deletedAt: null },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error restoring: ${error.message}`);
    }
  }

  async findAllActive(filter = {}, options = {}) {
    try {
      return await this.model.find({ ...filter, isDeleted: { $ne: true } }, null, options);
    } catch (error) {
      throw new Error(`Error finding active documents: ${error.message}`);
    }
  }

  async findWithPagination(filter = {}, page = 1, limit = 10, sort = {}) {
    try {
      const skip = (page - 1) * limit;
      const total = await this.model.countDocuments(filter);
      const data = await this.model.find(filter).sort(sort).skip(skip).limit(limit);
      return {
        data,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Error with pagination: ${error.message}`);
    }
  }

  buildSort(sortBy = 'createdAt', order = 'desc') {
    const sortOrder = order === 'asc' ? 1 : -1;
    return { [sortBy]: sortOrder };
  }

  buildTextSearch(searchTerm, fields = []) {
    if (!searchTerm || fields.length === 0) return {};
    const regex = new RegExp(searchTerm, 'i');
    return { $or: fields.map(field => ({ [field]: regex })) };
  }

  buildDateRangeFilter(field, startDate, endDate) {
    const filter = {};
    if (startDate) filter[field] = { $gte: new Date(startDate) };
    if (endDate) {
      filter[field] = filter[field] || {};
      filter[field].$lte = new Date(endDate);
    }
    return filter;
  }
}

module.exports = BaseRepository;
