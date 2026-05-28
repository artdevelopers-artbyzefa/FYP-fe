/**
 * Database Seed Script
 *
 * Creates initial admin user and default FYP phases.
 *
 * Usage:
 *   node seed.js
 *
 * @module seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('./models/index');

const seed = async () => {
  await connectDB();

  const User = mongoose.model('User');
  const Phase = mongoose.model('Phase');

  // Create admin user if not exists
  const adminExists = await User.findOne({ email: 'admin@cuiatd.edu.pk' });
  if (!adminExists) {
    await User.create({
      name: 'System Administrator',
      email: 'admin@cuiatd.edu.pk',
      password: 'admin123',
      role: 'admin',
      status: 'Active',
    });
    console.log('[Seed] Admin user created: admin@cuiatd.edu.pk / admin123');
  } else {
    console.log('[Seed] Admin user already exists');
  }

  // Create default phases
  const defaultPhases = [
    { key: 'registration', label: 'Registration', order: 1, active: false },
    { key: 'proposal', label: 'Proposal Submission', order: 2, active: false },
    { key: 'supervision', label: 'Supervision', order: 3, active: false },
    { key: 'evaluation', label: 'Evaluation', order: 4, active: false },
    { key: 'completion', label: 'Completion', order: 5, active: false },
  ];

  for (const phase of defaultPhases) {
    await Phase.findOneAndUpdate(
      { key: phase.key },
      phase,
      { upsert: true, new: true }
    );
  }
  console.log('[Seed] Default phases created');

  console.log('[Seed] Complete');
  process.exit(0);
};

seed().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
