const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    targetRoles: [{ type: String }],
    locations: [{ type: String }],
    minSalary: { type: Number, default: 0 },
    platforms: {
      naukri: { type: Boolean, default: true },
      indeed: { type: Boolean, default: true },
      linkedin: { type: Boolean, default: true },
    },
    dailyApplyCap: { type: Number, default: 15, max: 50 },
    searchSchedule: { type: String, default: '0 9 * * *' }, // Cron format, e.g., 9 AM daily
  },
  { timestamps: true }
);

module.exports = mongoose.model('Preference', preferenceSchema);
