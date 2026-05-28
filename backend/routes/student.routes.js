/**
 * Student Routes
 *
 * All student-facing functionality: profile management, partner search/requests,
 * supervisor requests, project ideas CRUD, and task management.
 *
 * @module routes/student
 *
 * @route GET    /api/student/profile
 * @route POST   /api/student/profile/update
 * @route GET    /api/student/partners/search?q=
 * @route POST   /api/student/partners/request
 * @route GET    /api/student/partners/incoming
 * @route POST   /api/student/partners/respond
 * @route GET    /api/student/supervisors
 * @route POST   /api/student/supervisors/request
 * @route POST   /api/student/ideas/submit
 * @route GET    /api/student/ideas/approved
 * @route POST   /api/student/ideas/select
 * @route GET    /api/student/tasks
 * @route POST   /api/student/tasks
 * @route PUT    /api/student/tasks/:id
 * @route DELETE /api/student/tasks/:id
 */

const express = require('express');
const { body, query, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  searchPartners,
  sendPartnerRequest,
  getIncomingRequests,
  respondPartnerRequest,
  getSupervisors,
  requestSupervisor,
  submitIdea,
  getApprovedIdeas,
  selectIdea,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/student.controller');

const router = express.Router();

// All student routes require authentication
router.use(authenticate);

// ---------------------------------------------------------------------------
// GET /api/student/profile
// Returns the authenticated student's profile data.
// Response: { name, email, regNo, semester, section, cgpa, fatherName, profileCompleted }
// ---------------------------------------------------------------------------
router.get('/profile', getProfile);

// ---------------------------------------------------------------------------
// POST /api/student/profile/update
// Updates the student's profile fields.
// Body: { name?, email?, regNo?, semester?, section?, cgpa?, fatherName? }
// ---------------------------------------------------------------------------
router.post('/profile/update', updateProfile);

// ---------------------------------------------------------------------------
// GET /api/student/partners/search?q=<query>
// Searches for potential project partners by regNo or email.
// Query: q (string, required, min 2 chars)
// Response: StudentPartner[]
// ---------------------------------------------------------------------------
router.get(
  '/partners/search',
  [query('q').trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters')],
  validate,
  searchPartners,
);

// ---------------------------------------------------------------------------
// POST /api/student/partners/request
// Sends a partner request to another student.
// Body: { studentId: string }
// ---------------------------------------------------------------------------
router.post(
  '/partners/request',
  [body('studentId').notEmpty().withMessage('Student ID is required')],
  validate,
  sendPartnerRequest,
);

// ---------------------------------------------------------------------------
// GET /api/student/partners/incoming
// Lists all incoming partner requests for the current student.
// Response: PartnerRequest[]
// ---------------------------------------------------------------------------
router.get('/partners/incoming', getIncomingRequests);

// ---------------------------------------------------------------------------
// POST /api/student/partners/respond
// Accepts or rejects an incoming partner request.
// Body: { requestId: string, status: 'accepted' | 'rejected' }
// ---------------------------------------------------------------------------
router.post(
  '/partners/respond',
  [
    body('requestId').notEmpty().withMessage('Request ID is required'),
    body('status').isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected'),
  ],
  validate,
  respondPartnerRequest,
);

// ---------------------------------------------------------------------------
// GET /api/student/supervisors
// Lists available faculty supervisors with their research tags.
// Response: Supervisor[]
// ---------------------------------------------------------------------------
router.get('/supervisors', getSupervisors);

// ---------------------------------------------------------------------------
// POST /api/student/supervisors/request
// Sends a supervisor request to a specific faculty member.
// Body: { supervisorId: string }
// ---------------------------------------------------------------------------
router.post(
  '/supervisors/request',
  [body('supervisorId').notEmpty().withMessage('Supervisor ID is required')],
  validate,
  requestSupervisor,
);

// ---------------------------------------------------------------------------
// POST /api/student/ideas/submit
// Submits a new project idea for faculty review.
// Body: { title, desc, tags: string[], supervisor?: string }
// ---------------------------------------------------------------------------
router.post(
  '/ideas/submit',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('desc').trim().notEmpty().withMessage('Description is required'),
    body('tags').isArray({ min: 1 }).withMessage('At least one tag is required'),
  ],
  validate,
  submitIdea,
);

// ---------------------------------------------------------------------------
// GET /api/student/ideas/approved
// Returns all approved project ideas available to the student.
// Response: ApprovedIdea[]
// ---------------------------------------------------------------------------
router.get('/ideas/approved', getApprovedIdeas);

// ---------------------------------------------------------------------------
// POST /api/student/ideas/select
// Selects an approved idea for implementation.
// Body: { ideaId: string }
// ---------------------------------------------------------------------------
router.post(
  '/ideas/select',
  [body('ideaId').notEmpty().withMessage('Idea ID is required')],
  validate,
  selectIdea,
);

// ---------------------------------------------------------------------------
// GET /api/student/tasks
// Returns the student's task list. Can be flat array or grouped by status.
// Response: Task[] | { [status: string]: Task[] }
// ---------------------------------------------------------------------------
router.get('/tasks', getTasks);

// ---------------------------------------------------------------------------
// POST /api/student/tasks
// Creates a new task for the student.
// Body: { title, categories, priority, date, assignee? }
// ---------------------------------------------------------------------------
router.post(
  '/tasks',
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('priority').optional().isIn(['high', 'medium', 'low']).withMessage('Invalid priority'),
  ],
  validate,
  createTask,
);

// ---------------------------------------------------------------------------
// PUT /api/student/tasks/:id
// Updates an existing task (status, title, progress, etc.)
// Params: id (number, required)
// Body: Partial<Task>
// ---------------------------------------------------------------------------
router.put(
  '/tasks/:id',
  [param('id').isNumeric().withMessage('Task ID must be a number')],
  validate,
  updateTask,
);

// ---------------------------------------------------------------------------
// DELETE /api/student/tasks/:id
// Deletes a task.
// Params: id (number, required)
// ---------------------------------------------------------------------------
router.delete(
  '/tasks/:id',
  [param('id').isNumeric().withMessage('Task ID must be a number')],
  validate,
  deleteTask,
);

module.exports = router;
