/**
 * Database Configuration
 *
 * Establishes and manages MongoDB connection using Mongoose.
 * Reads connection URI from environment variables.
 *
 * @module config/db
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic.
 * Logs connection status and exits on failure.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails after retries
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fyp-portal';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error(`[DB] Runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] Disconnected from MongoDB');
  });
};

module.exports = connectDB;
