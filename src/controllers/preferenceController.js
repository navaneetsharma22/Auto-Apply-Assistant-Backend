const Preference = require('../models/Preference');

const getPreferences = async (req, res, next) => {
  try {
    let pref = await Preference.findOne({ userId: req.user.id });
    if (!pref) {
      pref = await Preference.create({ userId: req.user.id });
    }
    res.status(200).json({ success: true, preferences: pref });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { targetRoles, locations, minSalary, platforms, dailyApplyCap, searchSchedule } = req.body;
    
    // Server-side enforcement of daily apply cap max
    const cap = dailyApplyCap !== undefined ? Math.min(Math.max(1, dailyApplyCap), 50) : 15;

    const pref = await Preference.findOneAndUpdate(
      { userId: req.user.id },
      { targetRoles, locations, minSalary, platforms, dailyApplyCap: cap, searchSchedule },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, preferences: pref });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreferences,
  updatePreferences,
};
