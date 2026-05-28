/**
 * FYP Portal Backend Server
 *
 * Entry point that starts the Express server and connects to MongoDB.
 * Reads configuration from environment variables.
 *
 * Usage:
 *   npm start         # Production mode
 *   npm run dev       # Development mode with nodemon
 *
 * Environment variables (see .env.example):
 *   PORT              - Server port (default: 5000)
 *   NODE_ENV          - Environment (development/production)
 *   MONGODB_URI       - MongoDB connection string
 *   JWT_SECRET        - Secret key for JWT signing
 *   BREVO_API_KEY     - Brevo transactional email API key
 *
 * @module server
 */

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Start the server.
 * Connects to MongoDB first, then starts listening.
 */
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Start Express server
  const server = app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════');
    console.log(`  FYP Portal API Server`);
    console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`  Port        : ${PORT}`);
    console.log(`  URL         : http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════════════');
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('[Server] Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught errors
  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled Promise Rejection:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('[Server] Uncaught Exception:', error);
    process.exit(1);
  });
};

startServer();
