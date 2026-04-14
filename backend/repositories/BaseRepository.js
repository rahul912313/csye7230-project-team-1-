/**
 * BaseRepository - Abstract base class for all repositories
 * Implements common CRUD operations
 * 
 * Design Pattern: Repository Pattern
 * Purpose: Abstract data access logic and provide a collection-like interface
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
}

module.exports = BaseRepository;
