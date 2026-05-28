const mongoose = require('mongoose');
const phaseSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: String, active: { type: Boolean, default: false }, order: Number,
}, { timestamps: true });
module.exports = mongoose.model('Phase', phaseSchema);
