const mongoose = require('mongoose');
const proposalSchema = new mongoose.Schema({
  title: String, students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  filePath: String, comments: String, rejectionJustification: String,
}, { timestamps: true });
module.exports = mongoose.model('Proposal', proposalSchema);
