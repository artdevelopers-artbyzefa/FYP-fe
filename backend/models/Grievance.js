const mongoose = require('mongoose');
const grievanceSchema = new mongoose.Schema({
  student: String, category: String, date: Date,
  status: { type: String, default: 'open' }, sla: String, desc: String,
  resolution: String, escalatedTo: String,
}, { timestamps: true });
module.exports = mongoose.model('Grievance', grievanceSchema);
