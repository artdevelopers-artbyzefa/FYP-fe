/**
 * Evaluation Routes
 *
 * Handles evaluation data retrieval and scorecard submission.
 * Supports faculty evaluations, committee evaluations, and industry evaluations.
 *
 * @module routes/evaluation
 *
 * @route GET  /api/evaluations/groups/:groupId
 * @route POST /api/v1/evaluations/submit
 */

const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getGroupEvaluation,
  submitScorecard,
} = require('../controllers/evaluation.controller');

const router = express.Router();

router.use(authenticate);

// ---------------------------------------------------------------------------
// GET /api/evaluations/groups/:groupId
// Returns evaluation data for a specific group.
// Access: Faculty, Committee Head, Industry evaluator
// Response: Evaluation data (scorecards, rubrics, comments)
// ---------------------------------------------------------------------------
router.get(
  '/groups/:groupId',
  [param('groupId').notEmpty().withMessage('Group ID is required')],
  validate,
  getGroupEvaluation,
);

// ---------------------------------------------------------------------------
// POST /api/v1/evaluations/submit
// Submits a complete scorecard for a group evaluation.
// Access: Faculty, Industry evaluator, Committee Head
// Body: { groupId, scores: [{ criterion, weight, score }], remarks? }
// ---------------------------------------------------------------------------
router.post(
  '/submit',
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

module.exports = router;
