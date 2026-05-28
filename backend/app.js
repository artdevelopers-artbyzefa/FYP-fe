/**
 * FYP Portal - Express Application (Crash-Proof)
 *
 * Every route require is wrapped in try-catch. If a module fails to load,
 * a diagnostic placeholder route is used instead. The server NEVER crashes.
 *
 * @module app
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { sendSuccess } = require('./utils/response');

// ---------------------------------------------------------------------------
// Safe require helper — returns null on failure instead of crashing
// ---------------------------------------------------------------------------
const safeRequire = (path, name) => {
  try {
    const mod = require(path);
    console.log(`[Route] ✓ ${name} loaded`);
    return mod;
  } catch (err) {
    console.error(`[Route] ✗ ${name} failed to load: ${err.message}`);
    // Return a placeholder router that returns 501
    const router = require('express').Router();
    router.all('*', (req, res) => {
      res.status(501).json({
        success: false,
        message: `${name} module not available`,
        error: err.message,
      });
    });
    return router;
  }
};

// Load models (crash-proof)
try { require('./models/index'); console.log('[Models] All models registered'); }
catch (e) { console.error('[Models] Failed to load models:', e.message); }

const app = express();

// Crash-proof morgan (optional dep)
try { app.use(require('morgan')(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); }
catch (e) { console.log('[Morgan] Skipped (not installed)'); }

// CORS — always works
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting — crash-proof
try {
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, max: 100,
    message: { success: false, message: 'Too many requests' },
  }));
} catch (e) { console.log('[RateLimit] Skipped'); }

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------------------------------------------------------------------------
// Health check — ALWAYS available
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  sendSuccess(res, {
    status: 'running',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    node: process.version,
  });
});

// ---------------------------------------------------------------------------
// API Routes — each loaded safely
// ---------------------------------------------------------------------------
app.use('/api/auth', safeRequire('./routes/auth.routes', 'Auth'));
app.use('/api/student', safeRequire('./routes/student.routes', 'Student'));
app.use('/api/faculty', safeRequire('./routes/faculty.routes', 'Faculty'));
app.use('/api/proposals', safeRequire('./routes/proposal.routes', 'Proposals'));
app.use('/api/supervision', safeRequire('./routes/supervision.routes', 'Supervision'));
app.use('/api/evaluations', safeRequire('./routes/evaluation.routes', 'Evaluations'));
app.use('/api/messages', safeRequire('./routes/messaging.routes', 'Messaging'));
app.use('/api/availability', safeRequire('./routes/availability.routes', 'Availability'));
app.use('/api/head', safeRequire('./routes/head.routes', 'Head'));
app.use('/api/hod', safeRequire('./routes/hod.routes', 'HOD'));
app.use('/api/office-assistant', safeRequire('./routes/officeAssistant.routes', 'OfficeAssistant'));
app.use('/api/office-incharge', safeRequire('./routes/officeIncharge.routes', 'OfficeIncharge'));
app.use('/api/phases', safeRequire('./routes/phase.routes', 'Phases'));
app.use('/api/admin', safeRequire('./routes/admin.routes', 'Admin'));
app.use('/api/industry', safeRequire('./routes/industry.routes', 'Industry'));
app.use('/api/user', safeRequire('./routes/user.routes', 'User'));
app.use('/api/dashboard', safeRequire('./routes/dashboard.routes', 'Dashboard'));
app.use('/api', safeRequire('./routes/email.routes', 'Email'));

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : 'Internal server error',
  });
});

module.exports = app;
