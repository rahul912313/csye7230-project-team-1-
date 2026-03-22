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

  /**
   * Find all documents matching the filter
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options (limit, skip, sort, etc.)
   * @returns {Promise<Array>} Array of documents
   */
  async findAll(filter = {}, options = {}) {
    try {
      return await this.model.find(filter, null, options);
    } catch (error) {
      throw new Error(`Error finding all: ${error.message}`);
    }
  }

  /**
   * Find a document by ID
   * @param {String} id - Document ID
   * @returns {Promise<Object>} Document or null
   */
  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error finding by ID: ${error.message}`);
    }
  }

  /**
   * Find one document matching the filter
   * @param {Object} filter - MongoDB filter object
   * @returns {Promise<Object>} Document or null
   */
  async findOne(filter) {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      throw new Error(`Error finding one: ${error.message}`);
    }
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating: ${error.message}`);
    }
  }

  /**
   * Update a document by ID
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Updated document
   */
  async update(id, data, options = { new: true, runValidators: true }) {
    try {
      return await this.model.findByIdAndUpdate(id, data, options);
    } catch (error) {
      throw new Error(`Error updating: ${error.message}`);
    }
  }

  /**
   * Delete a document by ID (hard delete)
   * @param {String} id - Document ID
   * @returns {Promise<Object>} Deleted document
   */
  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting: ${error.message}`);
    }
  }

  /**
   * Soft delete a document by ID
   * @param {String} id - Document ID
   * @returns {Promise<Object>} Updated document with isDeleted flag
   */
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

  /**
   * Restore a soft deleted document
   * @param {String} id - Document ID
   * @returns {Promise<Object>} Restored document
   */
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

  /**
   * Find all non-deleted documents
   * @param {Object} filter - MongoDB filter object
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of non-deleted documents
   */
  async findAllActive(filter = {}, options = {}) {
    try {
      return await this.model.find({ ...filter, isDeleted: { $ne: true } }, null, options);
    } catch (error) {
      throw new Error(`Error finding active documents: ${error.message}`);
    }
  }

  /**
   * Count documents matching the filter
   * @param {Object} filter - MongoDB filter object
   * @returns {Promise<Number>} Count of documents
   */
  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw new Error(`Error counting: ${error.message}`);
    }
  }

  /**
   * Check if a document exists
   * @param {Object} filter - MongoDB filter object
   * @returns {Promise<Boolean>} True if exists, false otherwise
   */
  async exists(filter) {
    try {
      const doc = await this.model.findOne(filter).select('_id');
      return !!doc;
    } catch (error) {
      throw new Error(`Error checking existence: ${error.message}`);
    }
  }

  /**
   * Find documents with pagination
   * @param {Object} filter - MongoDB filter object
   * @param {Number} page - Page number (starts from 1)
   * @param {Number} limit - Number of items per page
   * @param {Object} sort - Sort options
   * @returns {Promise<Object>} Paginated results with metadata
   */
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

  /**
   * Build sort object from query string
   * @param {String} sortBy - Field to sort by
   * @param {String} order - Sort order ('asc' or 'desc')
   * @returns {Object} MongoDB sort object
   */
  buildSort(sortBy = 'createdAt', order = 'desc') {
    const sortOrder = order === 'asc' ? 1 : -1;
    return { [sortBy]: sortOrder };
  }

  /**
   * Build filter object for text search
   * @param {String} searchTerm - Search term
   * @param {Array} fields - Fields to search in
   * @returns {Object} MongoDB filter object
   */
  buildTextSearch(searchTerm, fields = []) {
    if (!searchTerm || fields.length === 0) return {};
    
    const regex = new RegExp(searchTerm, 'i');
    return {
      $or: fields.map(field => ({ [field]: regex }))
    };
  }

  /**
   * Build date range filter
   * @param {String} field - Date field name
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} MongoDB filter object
   */
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
