/**
 * Phase Routes
 *
 * Manages FYP lifecycle phases (registration, proposal submission,
 * supervision, evaluation, etc.). Controls which phase is currently active
 * and the ordering of phases.
 *
 * @module routes/phase
 *
 * @route GET /api/phases
 * @route PUT /api/phases/active
 */

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getPhases,
  updateActivePhase,
} = require('../controllers/phase.controller');

const router = express.Router();

router.use(authenticate);

// ---------------------------------------------------------------------------
// GET /api/phases
// Returns all FYP phases with their active status and ordering.
// Access: All authenticated users
// Response: Phase[]
// ---------------------------------------------------------------------------
router.get('/', getPhases);

// ---------------------------------------------------------------------------
// PUT /api/phases/active
// Sets the currently active FYP phase.
// Access: Office In-charge, Admin
// Body: { key: string }
// ---------------------------------------------------------------------------
router.put(
  '/active',
  authorize('office-incharge', 'admin'),
  [
    body('key').trim().notEmpty().withMessage('Phase key is required'),
  ],
  validate,
  updateActivePhase,
);

module.exports = router;
