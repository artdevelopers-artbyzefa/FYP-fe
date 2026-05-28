/**
 * Phase Controller
 *
 * Manages FYP lifecycle phases (registration, proposal, supervision, evaluation).
 *
 * @module controllers/phase
 */
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getPhases = async (req, res, next) => {
  try {
    const Phase = require('mongoose').model('Phase');
    const phases = await Phase.find().sort({ order: 1 });
    sendSuccess(res, phases);
  } catch (error) { next(error); }
};

const updateActivePhase = async (req, res, next) => {
  try {
    const Phase = require('mongoose').model('Phase');
    await Phase.updateMany({}, { active: false });
    const phase = await Phase.findOneAndUpdate({ key: req.body.key }, { active: true }, { new: true });
    if (!phase) return sendError(res, 'Phase not found', 404);
    sendSuccess(res, phase, 'Active phase updated');
  } catch (error) { next(error); }
};

module.exports = { getPhases, updateActivePhase };
