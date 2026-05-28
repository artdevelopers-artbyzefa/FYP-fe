/**
 * Database Configuration
 *
 * Establishes and manages MongoDB connection using Mongoose.
 * Reads connection URI from environment variables.
 * Does NOT crash the server on connection failure — logs and sets ready flag.
 *
 * @module config/db
 */

const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB.
 * Does NOT exit the process on failure — server stays up to serve
 * health checks and return proper error responses.
 *
 * @async
 * @function connectDB
 * @returns {Promise<boolean>} Whether connection was successful
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fyp-portal';

  // Register event listeners before attempting connection
  mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error(`[DB] Runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[DB] Disconnected from MongoDB');
  });

  mongoose.connection.on('reconnected', () => {
    isConnected = true;
    console.log('[DB] Reconnected to MongoDB');
  });

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`[DB] Connection error: ${error.message}`);
    console.error('[DB] Server will start without database. Endpoints requiring DB will return 503.');
    return false;
  }
};

/**
 * Check if MongoDB is currently connected.
 * @returns {boolean}
 */
const getDbStatus = () => isConnected;

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
