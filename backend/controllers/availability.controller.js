/**
 * Availability Controller
 *
 * CRUD operations for faculty weekly availability schedule.
 *
 * @module controllers/availability
 */
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const Availability = require('mongoose').model('Availability');
    const slots = await Availability.find({ userId: req.user.id });
    sendSuccess(res, slots);
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const Availability = require('mongoose').model('Availability');
    const slot = await Availability.create({ ...req.body, userId: req.user.id });
    sendCreated(res, slot);
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const Availability = require('mongoose').model('Availability');
    const slot = await Availability.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!slot) return sendError(res, 'Availability slot not found', 404);
    sendSuccess(res, slot, 'Slot updated');
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const Availability = require('mongoose').model('Availability');
    const slot = await Availability.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!slot) return sendError(res, 'Availability slot not found', 404);
    sendSuccess(res, null, 'Slot deleted');
  } catch (error) { next(error); }
};

module.exports = { getAll, create, update, remove };
