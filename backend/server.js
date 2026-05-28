/**
 * FYP Portal Backend Server
 *
 * Simplified entry point. Uses Express's native app.listen().
 * Every other module is loaded crash-proof via app.js.
 *
 * @module server
 */

require('dotenv').config();

let app;
try {
  app = require('./app');
} catch (err) {
  console.error('[FATAL] Could not load app.js:', err.message);
  console.error(err.stack);
  // Start a bare-bones HTTP server that returns the error
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message: 'Server failed to initialize',
      error: err.message,
      stack: err.stack,
    }));
  });
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`[Fallback] Server running in ERROR mode on port ${PORT}`);
  });
  process.on('uncaughtException', () => {});
  return;
}

const PORT = process.env.PORT || 5000;

// Start Express app directly
const server = app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════');
  console.log(`  FYP Portal API Server`);
  console.log(`  Port   : ${PORT}`);
  console.log(`  Mode   : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Node   : ${process.version}`);
  console.log(`  Health : http://localhost:${PORT}/api/health`);
  console.log('═══════════════════════════════════════════════');
});

// Connect to DB in background (never blocks startup)
setTimeout(() => {
  try { require('./config/db')(); } catch (e) { /* db not available */ }
}, 100);

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n[Server] ${signal}. Shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => console.error('[Server] Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err.message);
  // Stay alive
});
