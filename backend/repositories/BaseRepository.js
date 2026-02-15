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
   * Delete a document by ID
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
}

module.exports = BaseRepository;
