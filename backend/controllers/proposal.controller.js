/**
 * Proposal Controller
 *
 * Handles proposal lifecycle: listing, viewing, downloading documents,
 * accepting, requesting revisions, and rejecting.
 *
 * @module controllers/proposal
 */
const { sendSuccess, sendError } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const Proposal = require('mongoose').model('Proposal');
    const proposals = await Proposal.find().populate('students', 'name regNo');
    sendSuccess(res, proposals);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const Proposal = require('mongoose').model('Proposal');
    const proposal = await Proposal.findById(req.params.id).populate('students', 'name regNo');
    if (!proposal) return sendError(res, 'Proposal not found', 404);
    sendSuccess(res, proposal);
  } catch (error) { next(error); }
};

const download = async (req, res, next) => {
  try {
    const Proposal = require('mongoose').model('Proposal');
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal || !proposal.filePath) return sendError(res, 'File not found', 404);
    res.download(proposal.filePath);
  } catch (error) { next(error); }
};

const accept = async (req, res, next) => {
  try {
    const Proposal = require('mongoose').model('Proposal');
    const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!proposal) return sendError(res, 'Proposal not found', 404);
    sendSuccess(res, null, 'Proposal accepted');
  } catch (error) { next(error); }
};

const requestRevisions = async (req, res, next) => {
  try {
    const Proposal = require('mongoose').model('Proposal');
    const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status: 'revision-requested', comments: req.body.comments }, { new: true });
    if (!proposal) return sendError(res, 'Proposal not found', 404);
    sendSuccess(res, null, 'Revision requested');
  } catch (error) { next(error); }
};

const reject = async (req, res, next) => {
  try {
    const Proposal = require('mongoose').model('Proposal');
    const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status: 'rejected', rejectionJustification: req.body.justification }, { new: true });
    if (!proposal) return sendError(res, 'Proposal not found', 404);
    sendSuccess(res, null, 'Proposal rejected');
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, download, accept, requestRevisions, reject };
