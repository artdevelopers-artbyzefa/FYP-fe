/**
 * User Model
 *
 * Represents all user types in the system: student, faculty, hod,
 * office-assistant, office-incharge, admin, industry.
 * Passwords are hashed via bcrypt before storage.
 *
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [3, 'Password must be at least 3 characters'],
      select: false, // Exclude from queries by default
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'hod', 'office-assistant', 'office-incharge', 'admin', 'industry'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['Active', 'Locked', 'Deactivated'],
      default: 'Active',
    },
    regNo: {
      type: String,
      trim: true,
      uppercase: true,
    },
    semester: String,
    section: String,
    cgpa: String,
    fatherName: String,
    designation: String,
    tags: [String],
    research: [String],
    avatar: String,
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
