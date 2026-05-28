/**
 * Admin Routes
 *
 * System administration: user management, RBAC, audit logging,
 * system health monitoring, database backup, cache clearing.
 * All routes restricted to 'admin' role only.
 *
 * @module routes/admin
 *
 * @route GET   /api/admin/dashboard/stats
 * @route GET   /api/admin/users
 * @route POST  /api/admin/users
 * @route POST  /api/admin/users/:id/reset-password
 * @route POST  /api/admin/users/:id/toggle-status
 * @route GET   /api/admin/rbac
 * @route GET   /api/admin/audit-logs
 * @route GET   /api/admin/system-health
 * @route POST  /api/admin/trigger-backup
 * @route POST  /api/admin/clear-cache
 * @route GET   /api/admin/notifications
 */

const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getStats,
  getUsers,
  createUser,
  resetPassword,
  toggleStatus,
  getRbacMatrix,
  getAuditLogs,
  getSystemHealth,
  triggerBackup,
  clearCache,
  getNotifications,
} = require('../controllers/admin.controller');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

// ---------------------------------------------------------------------------
// GET /api/admin/dashboard/stats
// Returns admin dashboard overview statistics.
// Response: { totalUsers, activeRoles, auditLogEntries, systemHealth }
// ---------------------------------------------------------------------------
router.get('/dashboard/stats', getStats);

// ---------------------------------------------------------------------------
// GET /api/admin/users
// Lists all system users with roles and account status.
// Response: AdminUser[]
// ---------------------------------------------------------------------------
router.get('/users', getUsers);

// ---------------------------------------------------------------------------
// POST /api/admin/users
// Creates a new user account with specified role.
// Body: { name: string, email: string, role: string }
// ---------------------------------------------------------------------------
router.post(
  '/users',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('role').notEmpty().withMessage('Role is required'),
  ],
  validate,
  createUser,
);

// ---------------------------------------------------------------------------
// POST /api/admin/users/:id/reset-password
// Resets a user's password to a temporary value and sends email.
// Path: id (string - user ID)
// ---------------------------------------------------------------------------
router.post(
  '/users/:id/reset-password',
  [param('id').notEmpty().withMessage('User ID is required')],
  validate,
  resetPassword,
);

// ---------------------------------------------------------------------------
// POST /api/admin/users/:id/toggle-status
// Toggles a user's account status between Active and Locked.
// Path: id (string - user ID)
// ---------------------------------------------------------------------------
router.post(
  '/users/:id/toggle-status',
  [param('id').notEmpty().withMessage('User ID is required')],
  validate,
  toggleStatus,
);

// ---------------------------------------------------------------------------
// GET /api/admin/rbac
// Returns the complete role-based access control matrix.
// Response: RbacEntry[]
// ---------------------------------------------------------------------------
router.get('/rbac', getRbacMatrix);

// ---------------------------------------------------------------------------
// GET /api/admin/audit-logs
// Returns system-wide audit log entries.
// Response: AuditLog[]
// ---------------------------------------------------------------------------
router.get('/audit-logs', getAuditLogs);

// ---------------------------------------------------------------------------
// GET /api/admin/system-health
// Returns server health metrics (CPU, RAM, DB, uptime).
// Response: { cpuLoad, ramUsed, ramTotal, dbUsed, dbTotal, uptime }
// ---------------------------------------------------------------------------
router.get('/system-health', getSystemHealth);

// ---------------------------------------------------------------------------
// POST /api/admin/trigger-backup
// Triggers a manual database backup.
// ---------------------------------------------------------------------------
router.post('/trigger-backup', triggerBackup);

// ---------------------------------------------------------------------------
// POST /api/admin/clear-cache
// Clears the application cache (Redis, in-memory, etc.).
// ---------------------------------------------------------------------------
router.post('/clear-cache', clearCache);

// ---------------------------------------------------------------------------
// GET /api/admin/notifications
// Returns admin notifications and alerts.
// Response: Notification[]
// ---------------------------------------------------------------------------
router.get('/notifications', getNotifications);

module.exports = router;
