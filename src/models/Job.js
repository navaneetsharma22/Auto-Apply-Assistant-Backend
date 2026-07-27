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
    approvedAt: { type: Date, default: null },
    skippedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

