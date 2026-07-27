const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    res.status(200).json({ success: true, profile: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, experienceYears, skills, resumeUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, experienceYears, skills, resumeUrl },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, profile: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
