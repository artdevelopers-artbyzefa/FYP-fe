/**
 * Messaging Routes
 *
 * Internal messaging system for faculty-student communication.
 * Supports group-based messaging for supervised project groups.
 *
 * @module routes/messaging
 *
 * @route GET  /api/messages/groups
 * @route GET  /api/messages/groups/:groupId
 * @route POST /api/messages/groups/:groupId
 */

const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getGroups,
  getMessages,
  sendMessage,
} = require('../controllers/messaging.controller');

const router = express.Router();

router.use(authenticate);

// ---------------------------------------------------------------------------
// GET /api/messages/groups
// Returns all messaging groups for the authenticated user.
// Response: MessagingGroup[]
// ---------------------------------------------------------------------------
router.get('/groups', getGroups);

// ---------------------------------------------------------------------------
// GET /api/messages/groups/:groupId
// Returns message history for a specific group.
// Path: groupId (string)
// Response: Message[]
// ---------------------------------------------------------------------------
router.get(
  '/groups/:groupId',
  [param('groupId').notEmpty().withMessage('Group ID is required')],
  validate,
  getMessages,
);

// ---------------------------------------------------------------------------
// POST /api/messages/groups/:groupId
// Sends a new message to a group.
// Path: groupId (string)
// Body: { text: string }
// ---------------------------------------------------------------------------
router.post(
  '/groups/:groupId',
  [
    param('groupId').notEmpty().withMessage('Group ID is required'),
    body('text').trim().notEmpty().withMessage('Message text is required'),
  ],
  validate,
  sendMessage,
);

module.exports = router;
