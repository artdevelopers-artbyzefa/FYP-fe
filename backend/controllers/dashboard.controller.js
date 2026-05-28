/**
 * Generic Dashboard Controller
 *
 * Reserved for future use - provides generic dashboard stats.
 *
 * @module controllers/dashboard
 */
const { sendSuccess } = require('../utils/response');

const getStats = async (req, res, next) => {
  try {
    sendSuccess(res, { message: 'Generic dashboard stats - reserved for future use' });
  } catch (error) { next(error); }
};

module.exports = { getStats };
