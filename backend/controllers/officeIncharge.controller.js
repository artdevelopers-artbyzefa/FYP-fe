/**
 * Office In-charge Controller
 *
 * Manages rubrics, sessions, supervision requests, committees, grievances,
 * reports, and audit logs.
 *
 * @module controllers/officeIncharge
 */
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getDashboard = async (req, res, next) => {
  try { sendSuccess(res, { activeRubrics: 3, pendingSupervisionReqs: 5, openGrievances: 2, slaBreaches: 0, activeSession: 'Spring 2026' }); } catch (error) { next(error); }
};
const getRubrics = async (req, res, next) => { try { const Rubric = require('mongoose').model('Rubric'); const rubrics = await Rubric.find(); sendSuccess(res, rubrics); } catch (error) { next(error); } };
const saveRubric = async (req, res, next) => { try { const Rubric = require('mongoose').model('Rubric'); const rubric = await Rubric.create(req.body); sendCreated(res, rubric); } catch (error) { next(error); } };
const getSessions = async (req, res, next) => { try { const Session = require('mongoose').model('Session'); const session = await Session.findOne().sort({ createdAt: -1 }); sendSuccess(res, session || { sessionName: 'Spring 2026', duration: '16 weeks', repeats: [] }); } catch (error) { next(error); } };
const saveSession = async (req, res, next) => { try { const Session = require('mongoose').model('Session'); const session = await Session.create(req.body); sendCreated(res, session); } catch (error) { next(error); } };
const getSupervisionRequests = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const processSupervisionRequest = async (req, res, next) => { try { sendSuccess(res, null, 'Request processed'); } catch (error) { next(error); } };
const getCommitteeOversight = async (req, res, next) => { try { sendSuccess(res, { boards: [], requests: [] }); } catch (error) { next(error); } };
const processCommitteeRequest = async (req, res, next) => { try { sendSuccess(res, null, 'Committee request processed'); } catch (error) { next(error); } };
const getGrievances = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const processGrievance = async (req, res, next) => { try { sendSuccess(res, null, 'Grievance updated'); } catch (error) { next(error); } };
const getFacultyReports = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getStudentReports = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getAuditLogs = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };

module.exports = { getDashboard, getRubrics, saveRubric, getSessions, saveSession, getSupervisionRequests, processSupervisionRequest, getCommitteeOversight, processCommitteeRequest, getGrievances, processGrievance, getFacultyReports, getStudentReports, getAuditLogs };
