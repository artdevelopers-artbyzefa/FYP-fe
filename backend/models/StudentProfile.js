const mongoose = require('mongoose');
const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  regNo: String, semester: String, section: String, cgpa: String, fatherName: String, whatsappNumber: String,
  status: { type: String, default: 'No Project' },
  project: String, supervisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
module.exports = mongoose.model('StudentProfile', studentProfileSchema);
