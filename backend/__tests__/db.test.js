const db = require('../db');

describe('Database Singleton', () => {
  it('should return the same instance on multiple requires', () => {
    const db1 = require('../db');
    const db2 = require('../db');
    
    expect(db1).toBe(db2);
  });

  it('should have connect method', () => {
    expect(typeof db.connect).toBe('function');
  });

  it('should have getConnection method', () => {
    expect(typeof db.getConnection).toBe('function');
  });

  it('should have isConnected method', () => {
    expect(typeof db.isConnected).toBe('function');
  });

  it('should have getStats method', () => {
    expect(typeof db.getStats).toBe('function');
  });
});
