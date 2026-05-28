const mongoose = require('mongoose');
const messagingGroupSchema = new mongoose.Schema({
  name: String, members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: String,
}, { timestamps: true });
module.exports = mongoose.model('MessagingGroup', messagingGroupSchema);
