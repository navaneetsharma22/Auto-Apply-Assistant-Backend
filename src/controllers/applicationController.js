const Application = require('../models/Application');
const Preference = require('../models/Preference');

const getApplications = async (req, res, next) => {
  try {
    const { status, platform } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (platform) filter.platform = platform;

    const applications = await Application.find(filter)
      .populate('jobId')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

const updateApplicationApproval = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { action } = req.body; // 'approve' or 'skip'

    if (!['approve', 'skip'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be approve or skip.' });
    }

    // Daily apply cap check when approving
    if (action === 'approve') {
      const pref = await Preference.findOne({ userId: req.user.id });
      const dailyCap = pref?.dailyApplyCap || 15;

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const approvedTodayCount = await Application.countDocuments({
        userId: req.user.id,
        status: { $in: ['approved', 'submitted'] },
        updatedAt: { $gte: startOfDay },
      });

      if (approvedTodayCount >= dailyCap) {
        return res.status(429).json({
          success: false,
          message: `Daily application limit of ${dailyCap} reached. Cannot approve more today.`,
        });
      }
    }

    const application = await Application.findOneAndUpdate(
      { _id: applicationId, userId: req.user.id },
      {
        status: action === 'approve' ? 'approved' : 'skipped',
        approved: action === 'approve',
      },
      { new: true }
    ).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  updateApplicationApproval,
};
