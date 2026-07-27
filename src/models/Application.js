const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    platform: { type: String, enum: ['naukri', 'indeed', 'linkedin'], required: true },
    status: {
      type: String,
      enum: ['pending_review', 'approved', 'skipped', 'submitted', 'failed'],
      default: 'pending_review',
    },
    approved: { type: Boolean, default: false, required: true }, // NON-NEGOTIABLE HUMAN APPROVAL FLAG
    prefilledData: { type: mongoose.Schema.Types.Mixed, default: {} },
    submittedAt: { type: Date, default: null },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
