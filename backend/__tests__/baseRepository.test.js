const BaseRepository = require('../repositories/BaseRepository');

/**
 * Test Suite for BaseRepository - Repository Pattern
 * Tests the Repository pattern implementation
 */

// Mock mongoose model
const mockModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
};

describe('BaseRepository - Repository Pattern', () => {
  let repository;

  beforeEach(() => {
    repository = new BaseRepository(mockModel);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      mockModel.find.mockResolvedValue(mockData);

      const result = await repository.findAll();

      expect(result).toEqual(mockData);
      expect(mockModel.find).toHaveBeenCalledWith({}, null, {});
    });

    it('should apply filter when provided', async () => {
      const filter = { active: true };
      mockModel.find.mockResolvedValue([]);

      await repository.findAll(filter);

      expect(mockModel.find).toHaveBeenCalledWith(filter, null, {});
    });
  });

  describe('findById', () => {
    it('should return document by id', async () => {
      const mockData = { _id: '123', name: 'Test' };
      mockModel.findById.mockResolvedValue(mockData);

      const result = await repository.findById('123');

      expect(result).toEqual(mockData);
      expect(mockModel.findById).toHaveBeenCalledWith('123');
    });

    it('should throw error when findById fails', async () => {
      mockModel.findById.mockRejectedValue(new Error('Database error'));

      await expect(repository.findById('123')).rejects.toThrow('Error finding by ID');
    });
  });

  describe('findOne', () => {
    it('should return one document matching filter', async () => {
      const mockData = { email: 'test@example.com' };
      mockModel.findOne.mockResolvedValue(mockData);

      const result = await repository.findOne({ email: 'test@example.com' });

      expect(result).toEqual(mockData);
      expect(mockModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const newData = { name: 'New Item' };
      const mockCreated = { _id: '123', ...newData };
      mockModel.create.mockResolvedValue(mockCreated);

      const result = await repository.create(newData);

      expect(result).toEqual(mockCreated);
      expect(mockModel.create).toHaveBeenCalledWith(newData);
    });

    it('should throw error when create fails', async () => {
      mockModel.create.mockRejectedValue(new Error('Validation error'));

      await expect(repository.create({})).rejects.toThrow('Error creating');
    });
  });

  describe('update', () => {
    it('should update document by id', async () => {
      const updateData = { name: 'Updated' };
      const mockUpdated = { _id: '123', ...updateData };
      mockModel.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await repository.update('123', updateData);

      expect(result).toEqual(mockUpdated);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        updateData,
        { new: true, runValidators: true }
      );
    });
  });

  describe('delete', () => {
    it('should delete document by id', async () => {
      const mockDeleted = { _id: '123', name: 'Deleted' };
      mockModel.findByIdAndDelete.mockResolvedValue(mockDeleted);

      const result = await repository.delete('123');

      expect(result).toEqual(mockDeleted);
      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });

  describe('count', () => {
    it('should return count of documents', async () => {
      mockModel.countDocuments.mockResolvedValue(5);

      const result = await repository.count();

      expect(result).toBe(5);
      expect(mockModel.countDocuments).toHaveBeenCalledWith({});
    });

    it('should apply filter when counting', async () => {
      const filter = { active: true };
      mockModel.countDocuments.mockResolvedValue(3);

      await repository.count(filter);

      expect(mockModel.countDocuments).toHaveBeenCalledWith(filter);
    });
  });

  describe('exists', () => {
    it('should return true when document exists', async () => {
      mockModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: '123' })
      });

      const result = await repository.exists({ email: 'test@example.com' });

      expect(result).toBe(true);
    });

    it('should return false when document does not exist', async () => {
      mockModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const result = await repository.exists({ email: 'notfound@example.com' });

      expect(result).toBe(false);
    });
  });

  describe('Helper Methods', () => {
    it('buildSort should create sort object', () => {
      const sort = repository.buildSort('name', 'asc');
      expect(sort).toEqual({ name: 1 });
    });

    it('buildSort should default to desc order', () => {
      const sort = repository.buildSort('createdAt');
      expect(sort).toEqual({ createdAt: -1 });
    });

    it('buildTextSearch should create regex filter', () => {
      const filter = repository.buildTextSearch('john', ['name', 'email']);
      expect(filter).toHaveProperty('$or');
      expect(filter.$or).toHaveLength(2);
    });

    it('buildTextSearch should return empty object when no search term', () => {
      const filter = repository.buildTextSearch('', ['name']);
      expect(filter).toEqual({});
    });

    it('buildDateRangeFilter should create date filter', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const filter = repository.buildDateRangeFilter('createdAt', startDate, endDate);
      
      expect(filter.createdAt).toHaveProperty('$gte');
      expect(filter.createdAt).toHaveProperty('$lte');
    });
  });

  describe('Soft Delete Methods', () => {
    it('softDelete should mark document as deleted', async () => {
      const mockUpdated = { _id: '123', isDeleted: true };
      mockModel.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await repository.softDelete('123');

      expect(result.isDeleted).toBe(true);
      expect(mockModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('restore should unmark deleted document', async () => {
      const mockRestored = { _id: '123', isDeleted: false };
      mockModel.findByIdAndUpdate.mockResolvedValue(mockRestored);

      const result = await repository.restore('123');

      expect(result.isDeleted).toBe(false);
    });

    it('findAllActive should exclude deleted documents', async () => {
      mockModel.find.mockResolvedValue([]);

      await repository.findAllActive();

      expect(mockModel.find).toHaveBeenCalledWith(
        { isDeleted: { $ne: true } },
        null,
        {}
      );
    });
  });

  describe('Pagination', () => {
    it('findWithPagination should return paginated results', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      mockModel.countDocuments.mockResolvedValue(20);
      mockModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockData)
      });

      const result = await repository.findWithPagination({}, 1, 10);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination.total).toBe(20);
      expect(result.pagination.pages).toBe(2);
    });

    it('findWithPagination should calculate correct pagination metadata', async () => {
      mockModel.countDocuments.mockResolvedValue(25);
      mockModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      });

      const result = await repository.findWithPagination({}, 2, 10);

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(true);
    });
  });
});
