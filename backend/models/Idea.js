const mongoose = require('mongoose');
const ideaSchema = new mongoose.Schema({
  title: String, desc: String, tags: [String], supervisor: String,
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  selectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, selectedAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('Idea', ideaSchema);
