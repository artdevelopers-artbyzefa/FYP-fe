const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String, status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
  categories: [String], priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  date: Date, overdue: Boolean, assignee: String, progress: Number,
}, { timestamps: true });
module.exports = mongoose.model('Task', taskSchema);
