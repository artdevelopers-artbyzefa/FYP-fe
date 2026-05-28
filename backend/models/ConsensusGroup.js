const mongoose = require('mongoose');
const consensusGroupSchema = new mongoose.Schema({
  groupId: String, title: String, committeeHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scores: [{ criterion: String, score: Number }],
  status: { type: String, default: 'pending-consensus' },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, publishedAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('ConsensusGroup', consensusGroupSchema);
