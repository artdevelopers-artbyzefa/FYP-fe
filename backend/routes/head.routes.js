/**
 * Committee Head Routes
 *
 * Handles consensus scoring, score publishing, and committee reassignment
 * requests for evaluation committee heads.
 *
 * @module routes/head
 *
 * @route GET  /api/head/consensus-groups
 * @route POST /api/v1/committee/publish
 * @route POST /api/head/consensus-groups/:groupId/reassign
 */

const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getConsensusGroups,
  publishConsensusScore,
  requestReassignment,
} = require('../controllers/head.controller');

const router = express.Router();

router.use(authenticate);
router.use(authorize('faculty', 'hod', 'office-incharge'));

// ---------------------------------------------------------------------------
// GET /api/head/consensus-groups
// Returns groups awaiting consensus scoring by the committee head.
// Response: ConsensusGroup[]
// ---------------------------------------------------------------------------
router.get('/consensus-groups', getConsensusGroups);

// ---------------------------------------------------------------------------
// POST /api/v1/committee/publish
// Publishes finalized consensus scores for a group.
// Body: { groupId: string, scores: object[] }
// ---------------------------------------------------------------------------
router.post(
  '/publish',
  [
    body('groupId').notEmpty().withMessage('Group ID is required'),
    body('scores').isArray({ min: 1 }).withMessage('Scores are required'),
  ],
  validate,
  publishConsensusScore,
);

// ---------------------------------------------------------------------------
// POST /api/head/consensus-groups/:groupId/reassign
// Requests reassignment of a group to a different committee.
// Path: groupId (string)
// ---------------------------------------------------------------------------
router.post(
  '/consensus-groups/:groupId/reassign',
  [param('groupId').notEmpty().withMessage('Group ID is required')],
  validate,
  requestReassignment,
);

module.exports = router;
