const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    skills: [{ type: String }],
    resumeUrl: { type: String, default: '' },
    resumePath: { type: String, default: '' },
    currentCTC: { type: mongoose.Schema.Types.Mixed, default: '' },
    expectedCTC: { type: mongoose.Schema.Types.Mixed, default: '' },
    noticePeriod: { type: mongoose.Schema.Types.Mixed, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

