/**
 * Faculty Controller
 *
 * Handles all faculty-related operations: dashboard stats, profile,
 * availability, proposals, supervision groups, messaging, evaluations,
 * and committee head duties.
 *
 * @module controllers/faculty
 */
const { sendSuccess } = require('../utils/response');

const getDashboard = async (req, res, next) => {
  try {
    const Group = require('mongoose').model('Group');
    const supervisedGroups = await Group.countDocuments({ supervisorId: req.user.id });
    sendSuccess(res, {
      supervisedGroups,
      supervisedCap: 8,
      pendingProposals: 3,
      weeklyLogs: '2 pending review',
      committeeHead: 'Evaluation Committee A',
    });
  } catch (error) { next(error); }
};

const getProfile = async (req, res, next) => {
  try {
    const User = require('mongoose').model('User');
    const user = await User.findById(req.user.id).select('name email designation tags research');
    sendSuccess(res, user || { tags: ['Artificial Intelligence', 'Machine Learning'] });
  } catch (error) { next(error); }
};

const getResearchTags = async (req, res, next) => {
  try {
    sendSuccess(res, ['Artificial Intelligence', 'Machine Learning', 'Computer Vision', 'NLP', 'IoT', 'Cybersecurity', 'Software Engineering', 'Data Science', 'Blockchain']);
  } catch (error) { next(error); }
};

const getAvailability = async (req, res, next) => {
  try {
    const Availability = require('mongoose').model('Availability');
    const slots = await Availability.find({ userId: req.user.id });
    sendSuccess(res, slots);
  } catch (error) { next(error); }
};

const getProposals = async (req, res, next) => {
  try {
    const Proposal = require('mongoose').model('Proposal');
    const proposals = await Proposal.find({ reviewerId: req.user.id });
    sendSuccess(res, proposals);
  } catch (error) { next(error); }
};

const getSupervisedGroups = async (req, res, next) => {
  try {
    const Group = require('mongoose').model('Group');
    const groups = await Group.find({ supervisorId: req.user.id }).populate('members', 'name regNo');
    sendSuccess(res, groups);
  } catch (error) { next(error); }
};

const getMessages = async (req, res, next) => {
  try {
    const Message = require('mongoose').model('Message');
    const messages = await Message.find({ recipientId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    sendSuccess(res, messages);
  } catch (error) { next(error); }
};

const getEvaluations = async (req, res, next) => {
  try {
    const Evaluation = require('mongoose').model('Evaluation');
    const evals = await Evaluation.find({ evaluatorId: req.user.id });
    sendSuccess(res, evals);
  } catch (error) { next(error); }
};

const getHeadDuties = async (req, res, next) => {
  try {
    sendSuccess(res, [{ committeeId: 'C001', activeMembers: 5, pendingConsolidations: 2, nextMeeting: '2026-06-05' }]);
  } catch (error) { next(error); }
};

const getGroups = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getHeadManagement = async (req, res, next) => { try { sendSuccess(res, {}); } catch (error) { next(error); } };

module.exports = { getDashboard, getProfile, getResearchTags, getAvailability, getProposals, getSupervisedGroups, getMessages, getEvaluations, getHeadDuties, getGroups, getHeadManagement };
