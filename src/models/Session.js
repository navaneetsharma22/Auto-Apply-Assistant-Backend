const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    platform: { type: String, enum: ['naukri', 'indeed', 'linkedin'], required: true },
    encryptedState: { type: String, default: '' },
    status: { type: String, default: 'connected' },
    expired: { type: Boolean, default: false },
    lastVerifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('Session', sessionSchema);

