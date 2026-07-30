const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    platform: { type: String, required: true },
    status: { type: String, default: 'applied', index: true },
    appliedAt: { type: Date, default: Date.now, index: true },
    submittedAt: { type: Date, default: null },
    prefilledData: { type: mongoose.Schema.Types.Mixed, default: {} },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true }
);

applicationSchema.index({ userId: 1, platform: 1, appliedAt: -1 });
applicationSchema.index({ userId: 1, appliedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);

