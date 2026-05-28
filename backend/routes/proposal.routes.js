/**
 * Proposal Routes
 *
 * Handles the full proposal lifecycle: listing, viewing details, downloading
 * proposal documents, accepting, requesting revisions, and rejecting.
 *
 * @module routes/proposal
 *
 * @route GET    /api/proposals
 * @route GET    /api/proposals/:id
 * @route GET    /api/proposals/:id/download
 * @route POST   /api/proposals/:id/accept
 * @route POST   /api/proposals/:id/revisions
 * @route POST   /api/proposals/:id/reject
 */

const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAll,
  getById,
  download,
  accept,
  requestRevisions,
  reject,
} = require('../controllers/proposal.controller');

const router = express.Router();

router.use(authenticate);

// ---------------------------------------------------------------------------
// GET /api/proposals
// Lists all proposals. Supports filtering by status, supervisor, or student.
// Access: Faculty, HOD, Office In-charge, Admin
// Response: Proposal[]
// ---------------------------------------------------------------------------
router.get('/', authorize('faculty', 'hod', 'office-incharge', 'admin'), getAll);

// ---------------------------------------------------------------------------
// GET /api/proposals/:id
// Returns full details of a single proposal by ID.
// Access: Faculty, HOD, Office In-charge, Admin, or the submitting student
// Response: Proposal (detailed)
// ---------------------------------------------------------------------------
router.get(
  '/:id',
  [param('id').notEmpty().withMessage('Proposal ID is required')],
  validate,
  getById,
);

// ---------------------------------------------------------------------------
// GET /api/proposals/:id/download
// Downloads the proposal document file (PDF/DOC).
// Access: Faculty, HOD, Office In-charge, or submitting student
// Response: Binary file (application/octet-stream)
// ---------------------------------------------------------------------------
router.get(
  '/:id/download',
  [param('id').notEmpty().withMessage('Proposal ID is required')],
  validate,
  download,
);

// ---------------------------------------------------------------------------
// POST /api/proposals/:id/accept
// Accepts a proposal. Changes status to 'approved'.
// Access: Faculty (supervisor), HOD, Office In-charge
// Body: none
// ---------------------------------------------------------------------------
router.post(
  '/:id/accept',
  [param('id').notEmpty().withMessage('Proposal ID is required')],
  validate,
  accept,
);

// ---------------------------------------------------------------------------
// POST /api/proposals/:id/revisions
// Requests revisions on a proposal with specific comments.
// Access: Faculty (supervisor)
// Body: { comments: string }
// ---------------------------------------------------------------------------
router.post(
  '/:id/revisions',
  [
    param('id').notEmpty().withMessage('Proposal ID is required'),
    body('comments').trim().notEmpty().withMessage('Revision comments are required'),
  ],
  validate,
  requestRevisions,
);

// ---------------------------------------------------------------------------
// POST /api/proposals/:id/reject
// Rejects a proposal with a justification.
// Access: Faculty (supervisor), HOD, Office In-charge
// Body: { justification: string }
// ---------------------------------------------------------------------------
router.post(
  '/:id/reject',
  [
    param('id').notEmpty().withMessage('Proposal ID is required'),
    body('justification').trim().notEmpty().withMessage('Justification is required'),
  ],
  validate,
  reject,
);

module.exports = router;
