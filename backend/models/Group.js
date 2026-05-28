const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
  title: String, supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  progress: String, logStatus: String, status: String,
}, { timestamps: true });
module.exports = mongoose.model('Group', groupSchema);
