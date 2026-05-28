/**
 * Email Routes
 *
 * Handles transactional email sending via Brevo (Sendinblue) API.
 * Primarily used for sending welcome emails with credentials
 * to newly registered/onboarded students.
 *
 * @module routes/email
 *
 * @route POST /api/send-welcome-email
 */

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { sendWelcomeEmail } = require('../controllers/email.controller');

const router = express.Router();

// ---------------------------------------------------------------------------
// POST /api/send-welcome-email
// Sends a welcome email with login credentials to a newly onboarded student.
// Security: No auth required (called from frontend registration flow)
// Body: { name: string, email: string, regNo: string, subject?: string }
// Response: { success: true, message: 'Welcome email sent successfully' }
// Errors:
//   400 - Missing required fields (name, email, regNo)
//   500 - BREVO_API_KEY not configured on server
//   502 - Brevo API returned an error
// ---------------------------------------------------------------------------
router.post(
  '/send-welcome-email',
  [
    body('name').trim().notEmpty().withMessage('Student name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid student email is required'),
    body('regNo').trim().notEmpty().withMessage('Registration number is required'),
  ],
  validate,
  sendWelcomeEmail,
);

module.exports = router;
