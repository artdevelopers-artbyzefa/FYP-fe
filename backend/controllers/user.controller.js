/**
 * User Controller
 *
 * Generic user profile get/update.
 *
 * @module controllers/user
 */
const { sendSuccess, sendError } = require('../utils/response');

const getProfile = async (req, res, next) => {
  try {
    const User = require('mongoose').model('User');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user);
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const User = require('mongoose').model('User');
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user, 'Profile updated');
  } catch (error) { next(error); }
};

module.exports = { getProfile, updateProfile };
