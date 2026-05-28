/**
 * Industry Supervisor Routes
 *
 * External industry supervisor functions: viewing assigned projects,
 * submitting evaluation scorecards, checking submission status,
 * and receiving notifications.
 *
 * @module routes/industry
 *
 * @route GET  /api/industry/assigned-projects
 * @route POST /api/industry/submit-scorecard
 * @route GET  /api/industry/scorecard-status
 * @route GET  /api/industry/notifications
 */

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAssignedProjects,
  submitScorecard,
  getScorecardStatus,
  getNotifications,
} = require('../controllers/industry.controller');

const router = express.Router();

router.use(authenticate);
router.use(authorize('industry', 'admin'));

// ---------------------------------------------------------------------------
// GET /api/industry/assigned-projects
// Returns projects assigned to the industry supervisor for evaluation.
// Response: AssignedProject[]
// ---------------------------------------------------------------------------
router.get('/assigned-projects', getAssignedProjects);

// ---------------------------------------------------------------------------
// POST /api/industry/submit-scorecard
// Submits an evaluation scorecard for an assigned project.
// Body: { groupId: string, scores: [{ criterion, weight, score }], remarks?: string }
// ---------------------------------------------------------------------------
router.post(
  '/submit-scorecard',
  [
    body('groupId').notEmpty().withMessage('Group ID is required'),
    body('scores').isArray({ min: 1 }).withMessage('At least one score is required'),
    body('scores.*.criterion').notEmpty().withMessage('Criterion name is required'),
    body('scores.*.weight').isNumeric().withMessage('Weight must be a number'),
    body('scores.*.score').isNumeric().withMessage('Score must be a number'),
  ],
  validate,
  submitScorecard,
);

// ---------------------------------------------------------------------------
// GET /api/industry/scorecard-status
// Returns the submission status of scorecards for assigned projects.
// Response: { submitted: string[], pending: string[] }
// ---------------------------------------------------------------------------
router.get('/scorecard-status', getScorecardStatus);

// ---------------------------------------------------------------------------
// GET /api/industry/notifications
// Returns notifications and alerts for the industry supervisor.
// Response: Notification[]
// ---------------------------------------------------------------------------
router.get('/notifications', getNotifications);

module.exports = router;
