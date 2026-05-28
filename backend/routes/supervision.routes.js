/**
 * Supervision Routes
 *
 * Manages supervised groups and weekly log approvals/rejections.
 * Used by faculty supervisors to track student group progress.
 *
 * @module routes/supervision
 *
 * @route GET  /api/supervision/groups
 * @route POST /api/supervision/groups/:groupId/logs/:logId/approve
 * @route POST /api/supervision/groups/:groupId/logs/:logId/reject
 */

const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getGroups,
  approveLog,
  rejectLog,
} = require('../controllers/supervision.controller');

const router = express.Router();

router.use(authenticate);
router.use(authorize('faculty', 'hod', 'office-incharge'));

// ---------------------------------------------------------------------------
// GET /api/supervision/groups
// Returns all groups supervised by the authenticated faculty member.
// Response: SupervisionGroup[]
// ---------------------------------------------------------------------------
router.get('/groups', getGroups);

// ---------------------------------------------------------------------------
// POST /api/supervision/groups/:groupId/logs/:logId/approve
// Approves a weekly log submission for a supervised group.
// Path: groupId (string), logId (string)
// Body: none
// ---------------------------------------------------------------------------
router.post(
  '/groups/:groupId/logs/:logId/approve',
  [
    param('groupId').notEmpty().withMessage('Group ID is required'),
    param('logId').notEmpty().withMessage('Log ID is required'),
  ],
  validate,
  approveLog,
);

// ---------------------------------------------------------------------------
// POST /api/supervision/groups/:groupId/logs/:logId/reject
// Rejects a weekly log with feedback for revision.
// Path: groupId (string), logId (string)
// Body: { feedback: string }
// ---------------------------------------------------------------------------
router.post(
  '/groups/:groupId/logs/:logId/reject',
  [
    param('groupId').notEmpty().withMessage('Group ID is required'),
    param('logId').notEmpty().withMessage('Log ID is required'),
    body('feedback').trim().notEmpty().withMessage('Feedback is required when rejecting a log'),
  ],
  validate,
  rejectLog,
);

module.exports = router;
