/**
 * Office Assistant Routes
 *
 * FYP Office Assistant administrative functions: user and student management,
 * faculty listings, project oversight, template content management,
 * external evaluator coordination, and results publishing.
 *
 * @module routes/officeAssistant
 *
 * @route GET  /api/office-assistant/dashboard
 * @route GET  /api/office-assistant/users
 * @route GET  /api/office-assistant/students
 * @route POST /api/office-assistant/students
 * @route GET  /api/office-assistant/faculty
 * @route GET  /api/office-assistant/projects
 * @route GET  /api/office-assistant/content
 * @route GET  /api/office-assistant/external
 * @route GET  /api/office-assistant/results
 * @route GET  /api/office-assistant/proposal-committee
 * @route GET  /api/office-assistant/eval-committee
 */

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getUsers,
  getStudents,
  createStudent,
  getFaculty,
  getProjects,
  getContent,
  getExternal,
  getResults,
  getProposalCommittee,
  getEvalCommittee,
} = require('../controllers/officeAssistant.controller');

const router = express.Router();

router.use(authenticate);
router.use(authorize('office-assistant', 'office-incharge', 'admin'));

// ---------------------------------------------------------------------------
// GET /api/office-assistant/dashboard
// Returns office assistant dashboard overview stats.
// Response: { totalUsers, activeUsers, fypStudents, activeProjects, committees }
// ---------------------------------------------------------------------------
router.get('/dashboard', getDashboard);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/users
// Lists all system users with roles and status.
// Response: OfficeUser[]
// ---------------------------------------------------------------------------
router.get('/users', getUsers);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/students
// Lists all enrolled students with FYP status and project info.
// Response: OfficeStudent[]
// ---------------------------------------------------------------------------
router.get('/students', getStudents);

// ---------------------------------------------------------------------------
// POST /api/office-assistant/students
// Manually onboards a new student into the system.
// Access: Office Assistant, Office In-charge
// Body: { name, regNo, email, semester?, fatherName?, whatsappNumber?, section?, cgpa? }
// Triggers: Sends welcome email with default credentials
// ---------------------------------------------------------------------------
router.post(
  '/students',
  [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('regNo').trim().notEmpty().withMessage('Registration number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  validate,
  createStudent,
);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/faculty
// Lists faculty members with supervision load and research areas.
// Response: OfficeFaculty[]
// ---------------------------------------------------------------------------
router.get('/faculty', getFaculty);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/projects
// Lists all FYP projects with status, supervisor, and tech stack.
// Response: OfficeProject[]
// ---------------------------------------------------------------------------
router.get('/projects', getProjects);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/content
// Returns template content items (presentation, thesis, report templates).
// Response: ContentItem[]
// ---------------------------------------------------------------------------
router.get('/content', getContent);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/external
// Lists external evaluators and their project assignments.
// Response: ExternalEvaluator[]
// ---------------------------------------------------------------------------
router.get('/external', getExternal);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/results
// Returns published evaluation results with final grades.
// Response: ResultEntry[]
// ---------------------------------------------------------------------------
router.get('/results', getResults);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/proposal-committee
// Returns proposal committee data (reserved).
// ---------------------------------------------------------------------------
router.get('/proposal-committee', getProposalCommittee);

// ---------------------------------------------------------------------------
// GET /api/office-assistant/eval-committee
// Returns evaluation committee data (reserved).
// ---------------------------------------------------------------------------
router.get('/eval-committee', getEvalCommittee);

module.exports = router;
