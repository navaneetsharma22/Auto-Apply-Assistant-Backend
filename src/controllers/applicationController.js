const Application = require('../models/Application');

// GET /api/applications
const getApplications = async (req, res) => {
  try {
    const { platform, status, dateFrom, dateTo } = req.query;

    const filter = { userId: req.userId };

    if (platform) {
      filter.platform = platform;
    }

    if (status) {
      filter.status = status;
    }

    if (dateFrom || dateTo) {
      filter.appliedAt = {};
      if (dateFrom) {
        filter.appliedAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.appliedAt.$lte = new Date(dateTo);
      }
    }

    const applications = await Application.find(filter).sort({ appliedAt: -1, createdAt: -1 });
    return res.status(200).json({ applications });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getApplications,
};

