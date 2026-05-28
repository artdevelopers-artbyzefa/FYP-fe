/**
 * Faculty Routes
 *
 * Faculty dashboard, profile, availability, proposals, supervision groups,
 * messaging, evaluations, and committee head duties.
 * All routes require 'faculty' role or higher.
 *
 * @module routes/faculty
 *
 * @route GET /api/faculty/dashboard
 * @route GET /api/faculty/profile
 * @route GET /api/faculty/research-tags
 * @route GET /api/faculty/availability
 * @route GET /api/faculty/proposals
 * @route GET /api/faculty/supervision
 * @route GET /api/faculty/messaging
 * @route GET /api/faculty/evaluations
 * @route GET /api/faculty/head-duties
 * @route GET /api/faculty/groups
 * @route GET /api/faculty/head-management
 */

const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getProfile,
  getResearchTags,
  getAvailability,
  getProposals,
  getSupervisedGroups,
  getMessages,
  getEvaluations,
  getHeadDuties,
  getGroups,
  getHeadManagement,
} = require('../controllers/faculty.controller');

const router = express.Router();

// All faculty routes require authentication + faculty role
router.use(authenticate);
router.use(authorize('faculty', 'hod', 'admin', 'office-incharge'));

// ---------------------------------------------------------------------------
// GET /api/faculty/dashboard
// Returns faculty dashboard statistics.
// Response: { supervisedGroups, supervisedCap, pendingProposals, weeklyLogs, committeeHead }
// ---------------------------------------------------------------------------
router.get('/dashboard', getDashboard);

// ---------------------------------------------------------------------------
// GET /api/faculty/profile
// Returns faculty profile including research tags and specializations.
// Response: { tags: string[] }
// ---------------------------------------------------------------------------
router.get('/profile', getProfile);

// ---------------------------------------------------------------------------
// GET /api/faculty/research-tags
// Returns all available research tags for filtering and selection.
// Response: string[]
// ---------------------------------------------------------------------------
router.get('/research-tags', getResearchTags);

// ---------------------------------------------------------------------------
// GET /api/faculty/availability
// Returns the faculty member's weekly availability schedule.
// Response: AvailabilitySlot[]
// ---------------------------------------------------------------------------
router.get('/availability', getAvailability);

// ---------------------------------------------------------------------------
// GET /api/faculty/proposals
// Returns proposals assigned to this faculty member for review.
// Response: Proposal[]
// ---------------------------------------------------------------------------
router.get('/proposals', getProposals);

// ---------------------------------------------------------------------------
// GET /api/faculty/supervision
// Returns groups currently supervised by this faculty member.
// Response: SupervisionGroup[]
// ---------------------------------------------------------------------------
router.get('/supervision', getSupervisedGroups);

// ---------------------------------------------------------------------------
// GET /api/faculty/messaging
// Returns recent messages for this faculty member.
// Response: Message[]
// ---------------------------------------------------------------------------
router.get('/messaging', getMessages);

// ---------------------------------------------------------------------------
// GET /api/faculty/evaluations
// Returns evaluation assignments for this faculty member.
// Response: Evaluation[]
// ---------------------------------------------------------------------------
router.get('/evaluations', getEvaluations);

// ---------------------------------------------------------------------------
// GET /api/faculty/head-duties
// Returns committee head duties if this faculty member is a committee head.
// Response: HeadDuty[]
// ---------------------------------------------------------------------------
router.get('/head-duties', getHeadDuties);

// ---------------------------------------------------------------------------
// GET /api/faculty/groups
// Returns all groups associated with this faculty member.
// Response: SupervisionGroup[]
// ---------------------------------------------------------------------------
router.get('/groups', getGroups);

// ---------------------------------------------------------------------------
// GET /api/faculty/head-management
// Returns head/management data for faculty in leadership roles.
// Response: object
// ---------------------------------------------------------------------------
router.get('/head-management', getHeadManagement);

module.exports = router;
