/**
 * FYP Portal Backend Server
 *
 * @module server
 */

require('dotenv').config();

const PORT = process.env.PORT || 5001;
let app;

try {
  app = require('./app');
} catch (err) {
  console.error('[FATAL] app.js failed:', err.message);
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: err.message }));
  });
  server.listen(PORT, '0.0.0.0', () => console.log(`Fallback on ${PORT}`));
  process.on('uncaughtException', () => {});
  return;
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`FYP Portal API on 0.0.0.0:${PORT}`);
});

setTimeout(() => {
  try {
    const p = require('./config/db')();
    if (p && p.catch) p.catch(() => {});
  } catch (_) {}
}, 100);

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});
