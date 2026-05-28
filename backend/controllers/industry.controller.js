/**
 * Industry Supervisor Controller
 *
 * Handles assigned projects, scorecard submissions, and notifications.
 *
 * @module controllers/industry
 */
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getAssignedProjects = async (req, res, next) => {
  try {
    const Project = require('mongoose').model('IndustryProject');
    const projects = await Project.find({ evaluatorId: req.user.id });
    sendSuccess(res, projects);
  } catch (error) { next(error); }
};
const submitScorecard = async (req, res, next) => {
  try {
    const Scorecard = require('mongoose').model('Scorecard');
    const scorecard = await Scorecard.findOneAndUpdate(
      { groupId: req.body.groupId, evaluatorId: req.user.id },
      { ...req.body, status: 'submitted', submittedAt: new Date() },
      { upsert: true, new: true }
    );
    sendCreated(res, scorecard, 'Scorecard submitted');
  } catch (error) { next(error); }
};
const getScorecardStatus = async (req, res, next) => { try { sendSuccess(res, { submitted: [], pending: [] }); } catch (error) { next(error); } };
const getNotifications = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };

module.exports = { getAssignedProjects, submitScorecard, getScorecardStatus, getNotifications };
