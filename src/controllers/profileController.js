const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ profile: user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { experienceYears } = req.body;

    if (experienceYears !== undefined) {
      if (typeof experienceYears !== 'number' || isNaN(experienceYears) || experienceYears < 0) {
        return res.status(400).json({ error: 'experienceYears must be a non-negative number' });
      }
    }

    const updateData = {};
    const allowedKeys = [
      'name',
      'phone',
      'skills',
      'resumeUrl',
      'resumePath',
      'currentCTC',
      'expectedCTC',
      'noticePeriod',
      'experienceYears',
    ];

    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedProfile = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ profile: updatedProfile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

