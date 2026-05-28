/**
 * HOD Routes
 *
 * Head of Department dashboard and management functions:
 * overview stats, escalated grievance oversight, faculty workload,
 * governance (committees & rubrics), and analytics (pass rates, CLOs).
 *
 * @module routes/hod
 *
 * @route GET /api/hod/dashboard
 * @route GET /api/hod/escalations
 * @route GET /api/hod/faculty-oversight
 * @route GET /api/hod/governance
 * @route GET /api/hod/analytics
 */

const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getEscalations,
  getFacultyWorkload,
  getGovernance,
  getAnalytics,
} = require('../controllers/hod.controller');

const router = express.Router();

router.use(authenticate);
router.use(authorize('hod', 'admin'));

// ---------------------------------------------------------------------------
// GET /api/hod/dashboard
// Returns HOD dashboard statistics.
// Response: { totalGroups, escalatedGrievances, activeFaculty, cloAttainmentAvg }
// ---------------------------------------------------------------------------
router.get('/dashboard', getDashboard);

// ---------------------------------------------------------------------------
// GET /api/hod/escalations
// Returns all escalated grievances requiring HOD attention.
// Response: Escalation[]
// ---------------------------------------------------------------------------
router.get('/escalations', getEscalations);

// ---------------------------------------------------------------------------
// GET /api/hod/faculty-oversight
// Returns faculty workload and compliance data.
// Response: FacultyWorkload[]
// ---------------------------------------------------------------------------
router.get('/faculty-oversight', getFacultyWorkload);

// ---------------------------------------------------------------------------
// GET /api/hod/governance
// Returns committee structure and rubric management data.
// Response: { committees: Committee[], rubrics: Rubric[] }
// ---------------------------------------------------------------------------
router.get('/governance', getGovernance);

// ---------------------------------------------------------------------------
// GET /api/hod/analytics
// Returns academic analytics: pass rates, grade distribution, CLO attainment.
// Response: { passRate, repeatRate, grades, clos }
// ---------------------------------------------------------------------------
router.get('/analytics', getAnalytics);

module.exports = router;
