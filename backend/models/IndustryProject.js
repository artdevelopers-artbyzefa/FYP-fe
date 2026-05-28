const mongoose = require('mongoose');
const industryProjectSchema = new mongoose.Schema({
  groupId: String, title: String, members: [String],
  evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  internalSupervisor: String, thesisFile: String,
  evaluationStatus: { type: String, enum: ['pending', 'submitted'], default: 'pending' },
  submittedAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('IndustryProject', industryProjectSchema);
