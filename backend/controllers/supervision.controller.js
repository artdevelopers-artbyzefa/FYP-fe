/**
 * Supervision Controller
 *
 * Manages supervised groups and weekly log approval workflow.
 *
 * @module controllers/supervision
 */
const { sendSuccess, sendError } = require('../utils/response');

const getGroups = async (req, res, next) => {
  try {
    const Group = require('mongoose').model('Group');
    const groups = await Group.find({ supervisorId: req.user.id });
    sendSuccess(res, groups);
  } catch (error) { next(error); }
};

const approveLog = async (req, res, next) => {
  try {
    const Log = require('mongoose').model('WeeklyLog');
    const log = await Log.findOneAndUpdate(
      { _id: req.params.logId, groupId: req.params.groupId },
      { status: 'approved', approvedBy: req.user.id, approvedAt: new Date() },
      { new: true }
    );
    if (!log) return sendError(res, 'Log not found', 404);
    sendSuccess(res, null, 'Log approved');
  } catch (error) { next(error); }
};

const rejectLog = async (req, res, next) => {
  try {
    const Log = require('mongoose').model('WeeklyLog');
    const log = await Log.findOneAndUpdate(
      { _id: req.params.logId, groupId: req.params.groupId },
      { status: 'rejected', feedback: req.body.feedback, rejectedBy: req.user.id, rejectedAt: new Date() },
      { new: true }
    );
    if (!log) return sendError(res, 'Log not found', 404);
    sendSuccess(res, null, 'Log rejected with feedback');
  } catch (error) { next(error); }
};

module.exports = { getGroups, approveLog, rejectLog };
