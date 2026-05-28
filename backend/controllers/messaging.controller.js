/**
 * Messaging Controller
 *
 * Handles group-based messaging for supervised project groups.
 *
 * @module controllers/messaging
 */
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getGroups = async (req, res, next) => {
  try {
    const Group = require('mongoose').model('MessagingGroup');
    const groups = await Group.find({ members: req.user.id });
    sendSuccess(res, groups);
  } catch (error) { next(error); }
};

const getMessages = async (req, res, next) => {
  try {
    const Message = require('mongoose').model('Message');
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    sendSuccess(res, messages);
  } catch (error) { next(error); }
};

const sendMessage = async (req, res, next) => {
  try {
    const Message = require('mongoose').model('Message');
    const message = await Message.create({
      groupId: req.params.groupId,
      senderId: req.user.id,
      senderName: req.user.name,
      text: req.body.text,
    });
    sendCreated(res, message, 'Message sent');
  } catch (error) { next(error); }
};

module.exports = { getGroups, getMessages, sendMessage };
