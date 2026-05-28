/**
 * Evaluation Controller
 *
 * Handles evaluation data retrieval and scorecard submissions.
 *
 * @module controllers/evaluation
 */
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getGroupEvaluation = async (req, res, next) => {
  try {
    const Evaluation = require('mongoose').model('Evaluation');
    const evaluation = await Evaluation.findOne({ groupId: req.params.groupId });
    if (!evaluation) return sendError(res, 'Evaluation not found', 404);
    sendSuccess(res, evaluation);
  } catch (error) { next(error); }
};

const submitScorecard = async (req, res, next) => {
  try {
    const Evaluation = require('mongoose').model('Evaluation');
    const evaluation = await Evaluation.findOneAndUpdate(
      { groupId: req.body.groupId },
      { ...req.body, submittedBy: req.user.id, submittedAt: new Date(), status: 'submitted' },
      { upsert: true, new: true }
    );
    sendCreated(res, evaluation, 'Scorecard submitted');
  } catch (error) { next(error); }
};

module.exports = { getGroupEvaluation, submitScorecard };
