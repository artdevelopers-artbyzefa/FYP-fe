const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  sessionName: { type: String, required: true },
  duration: String,
  repeats: [{ name: String, regNo: String, status: String }],
}, { timestamps: true });
module.exports = mongoose.model('Session', sessionSchema);
