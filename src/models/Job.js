const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true },
    platform: { type: String, enum: ['naukri', 'indeed', 'linkedin'], required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    salary: { type: String, default: '' },
    description: { type: String, default: '' },
    jobUrl: { type: String, required: true },
    rawFormDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

jobSchema.index({ externalId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('Job', jobSchema);
