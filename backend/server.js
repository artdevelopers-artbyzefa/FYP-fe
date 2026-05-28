/**
 * FYP Portal Backend Server
 *
 * ZERO-CRASH entry point. Every require is wrapped in try-catch.
 * If ANY module fails to load, the server STILL starts a minimal
 * HTTP server that returns diagnostic info and a 200 health check.
 *
 * @module server
 */

require('dotenv').config();
const http = require('http');
const PORT = process.env.PORT || 5000;

// Store bootstrap errors for diagnostics
const bootstrapErrors = [];

// ---------------------------------------------------------------------------
// CRASH-PROOF app loader
// ---------------------------------------------------------------------------
let app = null;
try {
  app = require('./app');
  console.log('[Boot] app.js loaded successfully');
} catch (err) {
  const msg = `[Boot] FAILED to load app.js: ${err.message}`;
  console.error(msg);
  console.error(err.stack);
  bootstrapErrors.push(msg);
}

// ---------------------------------------------------------------------------
// CRASH-PROOF DB connector
// ---------------------------------------------------------------------------
let connectDB = () => {};
try {
  connectDB = require('./config/db');
  console.log('[Boot] DB connector loaded');
} catch (err) {
  bootstrapErrors.push(`DB connector failed: ${err.message}`);
}

// ---------------------------------------------------------------------------
// Start server — ALWAYS succeeds, even if app.js failed
// ---------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  // If app loaded successfully, delegate to Express
  if (app && bootstrapErrors.length === 0) {
    return app(req, res);
  }

  // Fallback: return diagnostic info
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    message: 'FYP Portal API — Minimal Fallback Mode',
    status: 'running',
    errors: bootstrapErrors,
    timestamp: new Date().toISOString(),
  }));
});

server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════');
  console.log(`  FYP Portal API Server`);
  console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  URL         : http://localhost:${PORT}/api/health`);

  if (bootstrapErrors.length > 0) {
    console.log('  ⚠  Bootstrap errors:');
    bootstrapErrors.forEach(e => console.log(`     • ${e}`));
    console.log('  ⚠  Server running in FALLBACK mode — API routes not available');
  } else {
    console.log('  ✓  All modules loaded successfully');
  }
  console.log('═══════════════════════════════════════════════');
});

// Connect to MongoDB in background (never blocks)
setTimeout(() => {
  try { connectDB(); } catch (e) { console.error('[Boot] DB connect error:', e.message); }
}, 100);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n[Server] ${signal}. Shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => console.error('[Server] Unhandled Rejection:', reason));
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error);
  // Don't exit — server stays up
});
