/**
 * Committee Head Controller
 *
 * Handles consensus scoring, publishing, and reassignment requests.
 *
 * @module controllers/head
 */
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getConsensusGroups = async (req, res, next) => {
  try {
    const Group = require('mongoose').model('ConsensusGroup');
    const groups = await Group.find({ committeeHeadId: req.user.id, status: 'pending-consensus' });
    sendSuccess(res, groups);
  } catch (error) { next(error); }
};

const publishConsensusScore = async (req, res, next) => {
  try {
    const Group = require('mongoose').model('ConsensusGroup');
    const group = await Group.findOneAndUpdate(
      { groupId: req.body.groupId },
      { scores: req.body.scores, status: 'published', publishedBy: req.user.id, publishedAt: new Date() },
      { new: true }
    );
    if (!group) return sendError(res, 'Group not found', 404);
    sendSuccess(res, null, 'Consensus scores published');
  } catch (error) { next(error); }
};

const requestReassignment = async (req, res, next) => {
  try {
    sendSuccess(res, null, 'Reassignment requested');
  } catch (error) { next(error); }
};

module.exports = { getConsensusGroups, publishConsensusScore, requestReassignment };
