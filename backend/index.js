const express = require('express');
const cors = require('cors');
const db = require('./db');
const rootRouter = require('./routes/index');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to QuickRent API',
    version: '1.0.0',
    status: 'Server is running'
  });
});

// Health check with database status
app.get('/health', (req, res) => {
  const dbStats = db.getStats();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStats.connected ? 'Connected' : 'Disconnected',
    dbInfo: dbStats
  });
});

// API Routes
app.use('/api', rootRouter);

// Error handling - must be last
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database first
    await db.connect();
    console.log('✅ Database connected successfully');

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 QuickRent Backend Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log(`👤 User API: http://localhost:${PORT}/api/user`);
      console.log(`🔐 Admin API: http://localhost:${PORT}/api/admin`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
