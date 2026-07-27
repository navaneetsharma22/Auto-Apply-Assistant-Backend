const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, default: 'Default Preference' },
    roles: [{ type: String }],
    locations: [{ type: String }],
    experience: { type: mongoose.Schema.Types.Mixed, default: '' },
    salaryRange: { type: mongoose.Schema.Types.Mixed, default: '' },
    jobType: { type: String, default: '' },
    platforms: [{ type: String }],
    dailyApplyCap: { type: Number, default: 15 },
    standardAnswers: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Preference', preferenceSchema);

