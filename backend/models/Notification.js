const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  icon: String, title: String, body: String,
  read: { type: Boolean, default: false }, color: String,
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);
