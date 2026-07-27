const Session = require('../models/Session');

const ALL_PLATFORMS = ['naukri', 'indeed', 'linkedin'];

// GET /api/sessions
const getSessions = async (req, res) => {
  try {
    const userSessions = await Session.find({ userId: req.userId }).select(
      'platform updatedAt expired status'
    );


    const sessionMap = new Map();
    userSessions.forEach((doc) => {
      sessionMap.set(doc.platform, doc);
    });

    const sessions = ALL_PLATFORMS.map((platform) => {
      if (sessionMap.has(platform)) {
        const doc = sessionMap.get(platform);
        return {
          platform,
          connected: !doc.expired && doc.status !== 'pending_manual_login',
          updatedAt: doc.updatedAt,
          expired: doc.expired || false,
        };
      }
      return {
        platform,
        connected: false,
      };
    });

    return res.status(200).json({ sessions });
  } catch (error) {
    console.error('[GET /api/sessions Error]', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// POST /api/sessions/:platform/initiate
const initiateSession = async (req, res) => {
  try {
    const { platform } = req.params;

    if (!ALL_PLATFORMS.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    await Session.findOneAndUpdate(
      { userId: req.userId, platform },
      {
        userId: req.userId,
        platform,
        status: 'pending_manual_login',
        expired: false,
      },
      { upsert: true, new: true }
    );

    return res.status(202).json({
      message: 'Login request queued. Open the desktop worker to complete login.',
    });
  } catch (error) {
    console.error('[POST /api/sessions/:platform/initiate Error]', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// DELETE /api/sessions/:platform
const deleteSession = async (req, res) => {
  try {
    const { platform } = req.params;

    if (!ALL_PLATFORMS.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    await Session.deleteOne({ userId: req.userId, platform });

    return res.status(200).json({ message: 'Session removed' });
  } catch (error) {
    console.error('[DELETE /api/sessions/:platform Error]', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
  getSessions,
  initiateSession,
  deleteSession,
};

