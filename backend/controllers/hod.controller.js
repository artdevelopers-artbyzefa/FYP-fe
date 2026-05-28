/**
 * HOD Controller
 *
 * Handles HOD dashboard, escalations, faculty oversight, governance, and analytics.
 *
 * @module controllers/hod
 */
const { sendSuccess } = require('../utils/response');

const getDashboard = async (req, res, next) => {
  try {
    sendSuccess(res, {
      totalGroups: 45,
      escalatedGrievances: 3,
      activeFaculty: 28,
      cloAttainmentAvg: '82.5%',
    });
  } catch (error) { next(error); }
};
const getEscalations = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getFacultyWorkload = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getGovernance = async (req, res, next) => { try { sendSuccess(res, { committees: [], rubrics: [] }); } catch (error) { next(error); } };
const getAnalytics = async (req, res, next) => {
  try {
    sendSuccess(res, { passRate: '92%', repeatRate: '8%', grades: [{ grade: 'A', percentage: 35 }, { grade: 'B', percentage: 40 }, { grade: 'C', percentage: 20 }, { grade: 'D', percentage: 5 }], clos: [{ name: 'CLO-1', average: 85 }, { name: 'CLO-2', average: 78 }, { name: 'CLO-3', average: 82 }] });
  } catch (error) { next(error); }
};

module.exports = { getDashboard, getEscalations, getFacultyWorkload, getGovernance, getAnalytics };
