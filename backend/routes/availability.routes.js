/**
 * Availability Routes
 *
 * Manages faculty weekly availability slots for supervision.
 * Supports CRUD operations on availability schedule entries.
 *
 * @module routes/availability
 *
 * @route GET    /api/availability
 * @route POST   /api/availability
 * @route PUT    /api/availability/:id
 * @route DELETE /api/availability/:id
 */

const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAll,
  create,
  update,
  remove,
} = require('../controllers/availability.controller');

const router = express.Router();

router.use(authenticate);
router.use(authorize('faculty', 'hod', 'office-incharge'));

// ---------------------------------------------------------------------------
// GET /api/availability
// Returns all availability slots for the authenticated faculty member.
// Response: AvailabilitySlot[]
// ---------------------------------------------------------------------------
router.get('/', getAll);

// ---------------------------------------------------------------------------
// POST /api/availability
// Creates a new availability slot for a specific day.
// Body: { day: string, slots: string[] }
// ---------------------------------------------------------------------------
router.post(
  '/',
  [
    body('day').trim().notEmpty().withMessage('Day is required'),
    body('slots').isArray({ min: 1 }).withMessage('At least one time slot is required'),
  ],
  validate,
  create,
);

// ---------------------------------------------------------------------------
// PUT /api/availability/:id
// Updates an existing availability slot.
// Path: id (string)
// Body: { day?, slots? }
// ---------------------------------------------------------------------------
router.put(
  '/:id',
  [param('id').notEmpty().withMessage('Availability ID is required')],
  validate,
  update,
);

// ---------------------------------------------------------------------------
// DELETE /api/availability/:id
// Deletes an availability slot.
// Path: id (string)
// ---------------------------------------------------------------------------
router.delete(
  '/:id',
  [param('id').notEmpty().withMessage('Availability ID is required')],
  validate,
  remove,
);

module.exports = router;
