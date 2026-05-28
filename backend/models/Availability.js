const mongoose = require('mongoose');
const availabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: String, slots: [String],
}, { timestamps: true });
module.exports = mongoose.model('Availability', availabilitySchema);
