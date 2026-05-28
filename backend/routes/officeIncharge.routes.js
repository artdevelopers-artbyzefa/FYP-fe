/**
 * Office In-charge Routes
 *
 * FYP Office In-charge management: rubrics, sessions, supervision requests,
 * committee oversight, grievances, faculty/student reports, and audit logs.
 *
 * @module routes/officeIncharge
 *
 * @route GET  /api/office-incharge/dashboard
 * @route GET  /api/office-incharge/rubrics
 * @route POST /api/office-incharge/rubrics
 * @route GET  /api/office-incharge/sessions
 * @route POST /api/office-incharge/sessions
 * @route GET  /api/office-incharge/supervision-requests
 * @route PUT  /api/office-incharge/supervision-requests/:requestId
 * @route GET  /api/office-incharge/committee-oversight
 * @route PUT  /api/office-incharge/committee-oversight/:committeeId
 * @route GET  /api/office-incharge/grievances
 * @route PUT  /api/office-incharge/grievances/:grievanceId
 * @route GET  /api/office-incharge/faculty-reports
 * @route GET  /api/office-incharge/student-reports
 * @route GET  /api/office-incharge/audit-log
 */

const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getRubrics,
  saveRubric,
  getSessions,
  saveSession,
  getSupervisionRequests,
  processSupervisionRequest,
  getCommitteeOversight,
  processCommitteeRequest,
  getGrievances,
  processGrievance,
  getFacultyReports,
  getStudentReports,
  getAuditLogs,
} = require('../controllers/officeIncharge.controller');

const router = express.Router();

router.use(authenticate);
router.use(authorize('office-incharge', 'admin'));

// ---------------------------------------------------------------------------
// GET /api/office-incharge/dashboard
// Returns in-charge dashboard statistics.
// Response: { activeRubrics, pendingSupervisionReqs, openGrievances, slaBreaches, activeSession }
// ---------------------------------------------------------------------------
router.get('/dashboard', getDashboard);

// ---------------------------------------------------------------------------
// GET /api/office-incharge/rubrics
// Lists all rubric versions with status and dates.
// Response: Rubric[]
// ---------------------------------------------------------------------------
router.get('/rubrics', getRubrics);

// ---------------------------------------------------------------------------
// POST /api/office-incharge/rubrics
// Creates a new rubric version.
// Body: { version: string, date?: string, status?: string }
// ---------------------------------------------------------------------------
router.post(
  '/rubrics',
  [
    body('version').trim().notEmpty().withMessage('Rubric version is required'),
  ],
  validate,
  saveRubric,
);

// ---------------------------------------------------------------------------
// GET /api/office-incharge/sessions
// Returns session data including repeat registration list.
// Response: { sessionName, duration, repeats: [...] }
// ---------------------------------------------------------------------------
router.get('/sessions', getSessions);

// ---------------------------------------------------------------------------
// POST /api/office-incharge/sessions
// Creates a new FYP session.
// Body: { sessionName: string, duration?: string }
// ---------------------------------------------------------------------------
router.post(
  '/sessions',
  [
    body('sessionName').trim().notEmpty().withMessage('Session name is required'),
  ],
  validate,
  saveSession,
);

// ---------------------------------------------------------------------------
// GET /api/office-incharge/supervision-requests
// Returns pending supervision load requests from faculty.
// Response: SupervisionRequest[]
// ---------------------------------------------------------------------------
router.get('/supervision-requests', getSupervisionRequests);

// ---------------------------------------------------------------------------
// PUT /api/office-incharge/supervision-requests/:requestId
// Approves or rejects a supervision load request.
// Path: requestId (string)
// Body: { status: string }
// ---------------------------------------------------------------------------
router.put(
  '/supervision-requests/:requestId',
  [
    param('requestId').notEmpty().withMessage('Request ID is required'),
    body('status').notEmpty().withMessage('Status is required'),
  ],
  validate,
  processSupervisionRequest,
);

// ---------------------------------------------------------------------------
// GET /api/office-incharge/committee-oversight
// Returns committee boards and pending requests.
// Response: { boards: CommitteeBoard[], requests: CommitteeRequest[] }
// ---------------------------------------------------------------------------
router.get('/committee-oversight', getCommitteeOversight);

// ---------------------------------------------------------------------------
// PUT /api/office-incharge/committee-oversight/:committeeId
// Processes a committee-related request (approve membership, change head, etc.).
// Path: committeeId (string)
// Body: { status: string }
// ---------------------------------------------------------------------------
router.put(
  '/committee-oversight/:committeeId',
  [
    param('committeeId').notEmpty().withMessage('Committee ID is required'),
    body('status').notEmpty().withMessage('Status is required'),
  ],
  validate,
  processCommitteeRequest,
);

// ---------------------------------------------------------------------------
// GET /api/office-incharge/grievances
// Returns all grievances with SLA status.
// Response: Grievance[]
// ---------------------------------------------------------------------------
router.get('/grievances', getGrievances);

// ---------------------------------------------------------------------------
// PUT /api/office-incharge/grievances/:grievanceId
// Resolves or escalates a grievance.
// Path: grievanceId (string)
// Body: { status?: string, resolution?: string }
// ---------------------------------------------------------------------------
router.put(
  '/grievances/:grievanceId',
  [
    param('grievanceId').notEmpty().withMessage('Grievance ID is required'),
  ],
  validate,
  processGrievance,
);

// ---------------------------------------------------------------------------
// GET /api/office-incharge/faculty-reports
// Returns faculty performance reports. Optional department filter.
// Query: dept? (string)
// Response: FacultyReport[]
// ---------------------------------------------------------------------------
router.get(
  '/faculty-reports',
  [
    query('dept').optional().trim(),
  ],
  validate,
  getFacultyReports,
);

// ---------------------------------------------------------------------------
// GET /api/office-incharge/student-reports
// Returns student progress reports. Optional filters.
// Query: regNo?, status?, session?
// Response: StudentReport[]
// ---------------------------------------------------------------------------
router.get(
  '/student-reports',
  [
    query('regNo').optional().trim(),
    query('status').optional().trim(),
  ],
  validate,
  getStudentReports,
);

// ---------------------------------------------------------------------------
// GET /api/office-incharge/audit-log
// Returns system audit log entries. Optional date range and user filter.
// Query: user?, type?, from? (date), to? (date)
// Response: AuditLog[]
// ---------------------------------------------------------------------------
router.get(
  '/audit-log',
  [
    query('user').optional().trim(),
    query('type').optional().trim(),
    query('from').optional().isISO8601().withMessage('Invalid date format for from'),
    query('to').optional().isISO8601().withMessage('Invalid date format for to'),
  ],
  validate,
  getAuditLogs,
);

module.exports = router;
