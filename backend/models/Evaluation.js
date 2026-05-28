const mongoose = require('mongoose');
const evaluationSchema = new mongoose.Schema({
  groupId: String, evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scores: [{ criterion: String, weight: Number, score: Number }],
  remarks: String, status: { type: String, default: 'pending' }, submittedAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('Evaluation', evaluationSchema);
