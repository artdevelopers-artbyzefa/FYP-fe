/**
 * FYP Portal - Express Application Entry Point
 *
 * Configures middleware and mounts all route modules.
 * Follows a clean layered architecture:
 *   routes -> controllers -> services -> models
 *
 * Middleware stack order:
 *   1. CORS
 *   2. Rate limiting
 *   3. Request logging (morgan)
 *   4. JSON body parsing
 *   5. Static file serving
 *   6. API routes (auth, student, faculty, hod, etc.)
 *   7. 404 handler
 *   8. Global error handler
 *
 * @module app
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Register all Mongoose models before any route uses them
require('./models/index');

const app = express();

// ---------------------------------------------------------------------------
// CORS Configuration
// Allows requests from the frontend origin specified in env vars.
// ---------------------------------------------------------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'https://fyp.artdevelopers.site',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ---------------------------------------------------------------------------
// Rate Limiting
// Prevents abuse of the API. General limit: 100 requests per 15 minutes.
// Auth endpoints have a stricter limit: 10 requests per 15 minutes.
// ---------------------------------------------------------------------------
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// ---------------------------------------------------------------------------
// Request Logging (Morgan)
// Logs HTTP method, URL, status, and response time.
// ---------------------------------------------------------------------------
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ---------------------------------------------------------------------------
// Body Parsing
// ---------------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------------------------------------------------------------------------
// Static Files (for serving uploaded documents, templates, etc.)
// ---------------------------------------------------------------------------
app.use('/uploads', express.static('uploads'));

// ---------------------------------------------------------------------------
// Health Check
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FYP Portal API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ---------------------------------------------------------------------------
// API Routes
// Each route module is mounted under /api/{module}
// ---------------------------------------------------------------------------

// Auth (public endpoints + authenticated logout/refresh)
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));

// Student (authenticated)
app.use('/api/student', require('./routes/student.routes'));

// Faculty (authenticated, faculty role)
app.use('/api/faculty', require('./routes/faculty.routes'));

// Proposals (authenticated, mixed roles)
app.use('/api/proposals', require('./routes/proposal.routes'));

// Supervision (authenticated, faculty role)
app.use('/api/supervision', require('./routes/supervision.routes'));

// Evaluations (authenticated, mixed roles)
app.use('/api/evaluations', require('./routes/evaluation.routes'));

// Messaging (authenticated)
app.use('/api/messages', require('./routes/messaging.routes'));

// Availability (authenticated, faculty role)
app.use('/api/availability', require('./routes/availability.routes'));

// Committee Head (authenticated, faculty/hod role)
app.use('/api/head', require('./routes/head.routes'));

// HOD (authenticated, hod role)
app.use('/api/hod', require('./routes/hod.routes'));

// Office Assistant (authenticated, office-assistant role)
app.use('/api/office-assistant', require('./routes/officeAssistant.routes'));

// Office In-charge (authenticated, office-incharge role)
app.use('/api/office-incharge', require('./routes/officeIncharge.routes'));

// Phases (authenticated)
app.use('/api/phases', require('./routes/phase.routes'));

// Admin (authenticated, admin role)
app.use('/api/admin', require('./routes/admin.routes'));

// Industry (authenticated, industry role)
app.use('/api/industry', require('./routes/industry.routes'));

// Email (no auth required for welcome email)
app.use('/api', require('./routes/email.routes'));

// ---------------------------------------------------------------------------
// User Profile Routes
// ---------------------------------------------------------------------------
app.use('/api/user', require('./routes/user.routes'));

// ---------------------------------------------------------------------------
// Dashboard (generic stats)
// ---------------------------------------------------------------------------
app.use('/api/dashboard', require('./routes/dashboard.routes'));

// ---------------------------------------------------------------------------
// Error Handling
// These must be registered AFTER all routes.
// ---------------------------------------------------------------------------

// 404 handler for unknown API routes
app.use('/api', notFoundHandler);

// Global error handler (4 parameters = Express error middleware)
app.use(errorHandler);

module.exports = app;
