const mongoose = require('mongoose');
const weeklyLogSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  week: Number, content: String, filePath: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  feedback: String, approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, approvedAt: Date,
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rejectedAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('WeeklyLog', weeklyLogSchema);
