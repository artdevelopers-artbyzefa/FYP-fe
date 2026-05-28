/**
 * FYP Portal Backend - Minimal Test Server
 */
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'running', uptime: process.uptime() });
});
app.get('/api/auth/login', (req, res) => {
  res.json({ success: true, message: 'Login test endpoint' });
});
app.all('/api/*', (req, res) => {
  res.json({ success: true, message: `${req.method} ${req.path}`, query: req.query });
});
app.all('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ success: false, message: 'not found' });
  res.json({ success: true, message: 'FYP Portal API' });
});

app.listen(PORT, () => {
  console.log(`FYP Portal API running on port ${PORT}`);
});

process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});
