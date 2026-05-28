/**
 * Office Assistant Controller
 *
 * Manages students, users, faculty, projects, content, externals, and results.
 *
 * @module controllers/officeAssistant
 */
const { sendSuccess, sendCreated, sendError } = require('../utils/response');

const getDashboard = async (req, res, next) => {
  try {
    const Student = require('mongoose').model('User');
    const totalStudents = await Student.countDocuments({ role: 'student' });
    const totalFaculty = await Student.countDocuments({ role: 'faculty' });
    sendSuccess(res, { totalUsers: totalStudents + totalFaculty, activeUsers: 'Active', fypStudents: totalStudents, studentsStatus: 'Enrolled', activeProjects: 76, projectsStatus: 'Assigned', committees: 8, committeesStatus: 'Operational' });
  } catch (error) { next(error); }
};
const getUsers = async (req, res, next) => { try { const User = require('mongoose').model('User'); const users = await User.find().select('-password'); sendSuccess(res, users); } catch (error) { next(error); } };
const getStudents = async (req, res, next) => { try { const Student = require('mongoose').model('StudentProfile'); const students = await Student.find().populate('userId', 'name email'); sendSuccess(res, students); } catch (error) { next(error); } };
const createStudent = async (req, res, next) => {
  try {
    const User = require('mongoose').model('User');
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return sendError(res, 'Email already in use', 409);
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('123', 10);
    const user = await User.create({ ...req.body, password: hashed, role: 'student', status: 'Active' });
    const StudentProfile = require('mongoose').model('StudentProfile');
    await StudentProfile.create({ userId: user._id, ...req.body });
    sendCreated(res, { id: user._id, name: user.name, email: user.email }, 'Student onboarded');
  } catch (error) { next(error); }
};
const getFaculty = async (req, res, next) => { try { const User = require('mongoose').model('User'); const faculty = await User.find({ role: 'faculty' }).select('name designation tags'); sendSuccess(res, faculty); } catch (error) { next(error); } };
const getProjects = async (req, res, next) => { try { const Project = require('mongoose').model('Project'); const projects = await Project.find(); sendSuccess(res, projects); } catch (error) { next(error); } };
const getContent = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getExternal = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getResults = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getProposalCommittee = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };
const getEvalCommittee = async (req, res, next) => { try { sendSuccess(res, []); } catch (error) { next(error); } };

module.exports = { getDashboard, getUsers, getStudents, createStudent, getFaculty, getProjects, getContent, getExternal, getResults, getProposalCommittee, getEvalCommittee };
