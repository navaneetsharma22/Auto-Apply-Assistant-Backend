const Session = require('../models/Session');
const { encrypt, decrypt } = require('../utils/encryption');

const saveSession = async (req, res, next) => {
  try {
    const { platform, sessionData } = req.body;

    if (!platform || !sessionData) {
      return res.status(400).json({ success: false, message: 'Platform and sessionData are required.' });
    }

    const encryptedSessionData = encrypt(sessionData);

    const session = await Session.findOneAndUpdate(
      { userId: req.user.id, platform },
      { encryptedSessionData, isActive: true, lastVerifiedAt: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: `Encrypted session saved for platform ${platform}`,
      session: { platform: session.platform, isActive: session.isActive, lastVerifiedAt: session.lastVerifiedAt },
    });
  } catch (error) {
    next(error);
  }
};

const getSessionStatus = async (req, res, next) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).select('-encryptedSessionData');
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveSession,
  getSessionStatus,
};
