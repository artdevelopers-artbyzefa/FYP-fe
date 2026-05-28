const mongoose = require('mongoose');
const rubricSchema = new mongoose.Schema({
  version: { type: String, required: true },
  date: Date, status: String,
}, { timestamps: true });
module.exports = mongoose.model('Rubric', rubricSchema);
