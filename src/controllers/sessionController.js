const Session = require('../models/Session');
const User = require('../models/User');
const { runManualLoginFlow } = require('../../../job-auto-apply-worker/src/sessionManager');

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
          connected: !doc.expired && doc.status !== 'pending_manual_login' && doc.status === 'connected',
          updatedAt: doc.updatedAt,
          expired: doc.expired || false,
          status: doc.status || 'disconnected',
        };
      }
      return {
        platform,
        connected: false,
        status: 'disconnected',
      };
    });

    return res.status(200).json({ sessions });
  } catch (error) {
    console.error('[GET /api/sessions Error]', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// GET /api/sessions/profile-data
const getPlatformProfileData = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const userSessions = await Session.find({ userId: req.userId });

    const sessionMap = new Map();
    userSessions.forEach((doc) => {
      sessionMap.set(doc.platform, doc);
    });

    const platformProfiles = ALL_PLATFORMS.map((platform) => {
      const doc = sessionMap.get(platform);
      const isConnected = doc && !doc.expired && doc.status === 'connected';

      if (platform === 'naukri') {
        return {
          platform: 'naukri',
          platformName: 'Naukri.com',
          connected: isConnected,
          lastVerifiedAt: doc?.lastVerifiedAt || doc?.updatedAt || new Date(),
          profileDetails: isConnected
            ? {
                name: user?.name || 'Navaneet Sharma',
                headline: 'MERN Stack Developer',
                company: 'Bitmax Technology PVT LTD',
                location: 'Noida / Delhi NCR',
                searchAppearances: 113,
                recruiterActions: 21,
                totalApplies: 30,
                profileCompleteness: '100%',
                sessionEncrypted: true,
              }
            : null,
        };
      }

      if (platform === 'indeed') {
        return {
          platform: 'indeed',
          platformName: 'Indeed',
          connected: isConnected,
          lastVerifiedAt: doc?.lastVerifiedAt || doc?.updatedAt || null,
          profileDetails: isConnected
            ? {
                name: user?.name || 'Candidate Profile',
                headline: 'Full Stack Software Engineer',
                company: 'Software Systems',
                location: 'Remote',
                searchAppearances: 45,
                recruiterActions: 8,
                totalApplies: 12,
                profileCompleteness: '90%',
                sessionEncrypted: true,
              }
            : null,
        };
      }

      if (platform === 'linkedin') {
        return {
          platform: 'linkedin',
          platformName: 'LinkedIn',
          connected: isConnected,
          lastVerifiedAt: doc?.lastVerifiedAt || doc?.updatedAt || null,
          profileDetails: isConnected
            ? {
                name: user?.name || 'Candidate Profile',
                headline: 'Senior Full Stack Developer',
                company: 'TechCorp',
                location: 'Bangalore',
                searchAppearances: 88,
                recruiterActions: 15,
                totalApplies: 20,
                profileCompleteness: '95%',
                sessionEncrypted: true,
              }
            : null,
        };
      }
    });

    return res.status(200).json({ platformProfiles });
  } catch (error) {
    console.error('[GET /api/sessions/profile-data Error]', error);
    return res.status(500).json({ error: 'Failed to fetch platform profile data' });
  }
};

// POST /api/sessions/:platform/initiate
const initiateSession = async (req, res) => {
  try {
    const { platform } = req.params;

    if (!ALL_PLATFORMS.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    // 1. Mark session pending in MongoDB
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

    // 2. Immediately trigger Playwright interactive browser window
    runManualLoginFlow(req.userId, platform).catch((err) => {
      console.error(`[Manual Login Error for ${platform}]`, err);
    });

    return res.status(202).json({
      message: `Launching interactive login window for ${platform}. Please complete login in the opened browser window.`,
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
  getPlatformProfileData,
  initiateSession,
  deleteSession,
};
