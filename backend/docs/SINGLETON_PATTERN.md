# Singleton Pattern Implementation - Database Connection

## Overview
The database connection module (`db.js`) implements the **Singleton Design Pattern** to ensure that only one database connection instance exists throughout the application lifecycle.

## Design Pattern: Singleton

### Intent
Ensure a class has only one instance and provide a global point of access to it.

### Problem Solved
Without Singleton:
- Multiple parts of the application might create separate database connections
- Resource wastage (each connection consumes memory and database resources)
- Inconsistent connection state across the application
- Connection pool conflicts

With Singleton:
- ✅ Single, shared database connection
- ✅ Efficient resource utilization
- ✅ Consistent connection state
- ✅ Centralized connection management

## Implementation Details

### Class Structure
```
DatabaseConnection (Singleton)
├── Private Properties
│   ├── instance (static) - The single instance
│   ├── connection - Mongoose connection object
│   └── isConnecting - Connection state flag
├── Public Methods
│   ├── connect() - Establish connection (lazy initialization)
│   ├── getConnection() - Access the connection
│   ├── isConnected() - Check connection status
│   ├── disconnect() - Close connection
│   └── getStats() - Get connection statistics
└── Private Methods
    ├── waitForConnection() - Handle concurrent connection attempts
    └── setupEventHandlers() - Manage connection lifecycle events
```

### Key Features

1. **Lazy Initialization**: Connection is only created when first needed
2. **Instance Reuse**: Subsequent connection attempts return existing instance
3. **Thread-Safety**: Handles concurrent connection attempts gracefully
4. **Event Handling**: Monitors connection lifecycle (error, disconnect, reconnect)
5. **Graceful Shutdown**: Cleans up resources on application termination

## Usage Examples

### Basic Usage
```javascript
// In index.js (application entry point)
const db = require('./db');
await db.connect();

// In any service file
const db = require('./db');
const connection = db.getConnection();
```

### Checking Connection Status
```javascript
const db = require('./db');

if (db.isConnected()) {
    console.log('Database is ready');
} else {
    await db.connect();
}
```

### Getting Connection Statistics
```javascript
const db = require('./db');
const stats = db.getStats();
console.log(`Connected to: ${stats.host}:${stats.port}/${stats.name}`);
```

## Benefits in Our Application

1. **Resource Efficiency**
   - Single connection pool for all requests
   - Reduced memory footprint
   - Lower database load

2. **Consistency**
   - All services use the same connection
   - Unified connection state
   - Centralized error handling

3. **Maintainability**
   - Single point of configuration
   - Easy to add connection monitoring
   - Simplified testing and debugging

4. **Scalability**
   - Connection pooling managed in one place
   - Easy to adjust pool size based on load
   - Predictable resource usage

## Testing the Singleton Pattern

Run the test file to verify Singleton behavior:
```bash
node testSingleton.js
```

This test demonstrates:
- Multiple imports return the same instance
- Connection state is shared across all references
- Duplicate connection attempts are handled gracefully
- All instances access the same connection object

## Comparison: Before vs After

### Before (Functional Approach)
```javascript
// db.js
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
module.exports = connectDB;

// Problems:
// - Could be called multiple times creating multiple connections
// - No way to check connection status
// - No centralized connection management
```

### After (Singleton Pattern)
```javascript
// db.js
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    DatabaseConnection.instance = this;
  }
  // ... methods
}
const instance = new DatabaseConnection();
module.exports = instance;

// Benefits:
// ✅ Guaranteed single instance
// ✅ Connection state management
// ✅ Reusable across application
```

## Related Patterns

- **Factory Pattern**: Could be used to create different types of database connections
- **Repository Pattern**: Uses the singleton connection to abstract data access
- **Dependency Injection**: Services receive the database instance rather than importing directly
