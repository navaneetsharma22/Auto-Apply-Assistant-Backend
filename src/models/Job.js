const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    externalId: { type: String, required: true },
    platform: { type: String, enum: ['naukri', 'indeed', 'linkedin'], required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    salary: { type: String, default: '' },
    description: { type: String, default: '' },
    jobUrl: { type: String, required: true },
    rawFormDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['new', 'queued', 'approved', 'applied', 'skipped'],
      default: 'queued',
      index: true,
    },
    needsManualReview: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null },
    skippedAt: { type: Date, default: null },
    appliedAt: { type: Date, default: null },
    submitAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ userId: 1, externalId: 1, platform: 1 }, { unique: true });
jobSchema.index({ userId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);

