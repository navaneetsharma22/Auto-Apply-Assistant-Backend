const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: ['naukri', 'indeed', 'linkedin'], required: true },
    encryptedSessionData: { type: String, required: true }, // Encrypted Playwright storageState JSON
    isActive: { type: Boolean, default: true },
    lastVerifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('Session', sessionSchema);
