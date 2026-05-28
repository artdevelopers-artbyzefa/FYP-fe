/**
 * Student Controller
 *
 * Handles all student-related operations: profile management,
 * partner search/requests, supervisor selection, idea management,
 * and task management.
 *
 * @module controllers/student
 */

const { sendSuccess, sendCreated, sendError } = require('../utils/response');

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
    const allowed = ['name', 'email', 'semester', 'section', 'cgpa', 'fatherName'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user, 'Profile updated');
  } catch (error) { next(error); }
};

const searchPartners = async (req, res, next) => {
  try {
    const { q } = req.query;
    const User = require('mongoose').model('User');
    const users = await User.find({
      role: 'student',
      _id: { $ne: req.user.id },
      $or: [
        { regNo: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    }).select('name email regNo semester section cgpa');
    sendSuccess(res, users);
  } catch (error) { next(error); }
};

const sendPartnerRequest = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const Request = require('mongoose').model('PartnerRequest');
    const existing = await Request.findOne({ fromId: req.user.id, toId: studentId, status: 'pending' });
    if (existing) return sendError(res, 'Request already sent', 409);
    await Request.create({ fromId: req.user.id, toId: studentId, status: 'pending' });
    sendCreated(res, null, 'Partner request sent');
  } catch (error) { next(error); }
};

const getIncomingRequests = async (req, res, next) => {
  try {
    const Request = require('mongoose').model('PartnerRequest');
    const requests = await Request.find({ toId: req.user.id, status: 'pending' }).populate('fromId', 'name email regNo');
    sendSuccess(res, requests);
  } catch (error) { next(error); }
};

const respondPartnerRequest = async (req, res, next) => {
  try {
    const { requestId, status } = req.body;
    const Request = require('mongoose').model('PartnerRequest');
    const request = await Request.findByIdAndUpdate(requestId, { status }, { new: true });
    if (!request) return sendError(res, 'Request not found', 404);
    sendSuccess(res, null, `Request ${status}`);
  } catch (error) { next(error); }
};

const getSupervisors = async (req, res, next) => {
  try {
    const User = require('mongoose').model('User');
    const supervisors = await User.find({ role: 'faculty', status: 'Active' }).select('name designation tags avatar');
    sendSuccess(res, supervisors);
  } catch (error) { next(error); }
};

const requestSupervisor = async (req, res, next) => {
  try {
    const { supervisorId } = req.body;
    const Request = require('mongoose').model('SupervisorRequest');
    await Request.create({ studentId: req.user.id, supervisorId, status: 'pending' });
    sendCreated(res, null, 'Supervisor request submitted');
  } catch (error) { next(error); }
};

const submitIdea = async (req, res, next) => {
  try {
    const Idea = require('mongoose').model('Idea');
    const idea = await Idea.create({ ...req.body, studentId: req.user.id, status: 'pending' });
    sendCreated(res, idea, 'Idea submitted');
  } catch (error) { next(error); }
};

const getApprovedIdeas = async (req, res, next) => {
  try {
    const Idea = require('mongoose').model('Idea');
    const ideas = await Idea.find({ status: 'approved' });
    sendSuccess(res, ideas);
  } catch (error) { next(error); }
};

const selectIdea = async (req, res, next) => {
  try {
    const { ideaId } = req.body;
    const Idea = require('mongoose').model('Idea');
    const idea = await Idea.findByIdAndUpdate(ideaId, { selectedBy: req.user.id, selectedAt: new Date() }, { new: true });
    if (!idea) return sendError(res, 'Idea not found', 404);
    sendSuccess(res, null, 'Idea selected');
  } catch (error) { next(error); }
};

const getTasks = async (req, res, next) => {
  try {
    const Task = require('mongoose').model('Task');
    const tasks = await Task.find({ userId: req.user.id }).sort({ date: -1 });
    sendSuccess(res, tasks);
  } catch (error) { next(error); }
};

const createTask = async (req, res, next) => {
  try {
    const Task = require('mongoose').model('Task');
    const task = await Task.create({ ...req.body, userId: req.user.id });
    sendCreated(res, task);
  } catch (error) { next(error); }
};

const updateTask = async (req, res, next) => {
  try {
    const Task = require('mongoose').model('Task');
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!task) return sendError(res, 'Task not found', 404);
    sendSuccess(res, task, 'Task updated');
  } catch (error) { next(error); }
};

const deleteTask = async (req, res, next) => {
  try {
    const Task = require('mongoose').model('Task');
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return sendError(res, 'Task not found', 404);
    sendSuccess(res, null, 'Task deleted');
  } catch (error) { next(error); }
};

module.exports = {
  getProfile, updateProfile, searchPartners, sendPartnerRequest,
  getIncomingRequests, respondPartnerRequest, getSupervisors,
  requestSupervisor, submitIdea, getApprovedIdeas, selectIdea,
  getTasks, createTask, updateTask, deleteTask,
};
