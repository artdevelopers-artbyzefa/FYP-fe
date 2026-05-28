/**
 * FYP Portal Backend - Minimal Test Server
 * Explicitly binds to 0.0.0.0 to ensure Nginx can reach it
 */
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'running', uptime: process.uptime(), port: PORT });
});
app.get('/api/auth/login', (req, res) => {
  res.json({ success: true, message: 'Login test endpoint' });
});
app.all('/api/*', (req, res) => {
  res.json({ success: true, message: `${req.method} ${req.path}` });
});
app.all('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ success: false, message: 'not found' });
  res.json({ success: true, message: 'FYP Portal API' });
});

// Bind to 0.0.0.0 explicitly for all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FYP Portal API running on 0.0.0.0:${PORT}`);
});

process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});
