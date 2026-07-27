const mongoose = require('mongoose');
const Preference = require('../models/Preference');

const ALLOWED_PLATFORMS = ['naukri', 'indeed', 'linkedin'];

// GET /api/preferences
const getPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find({ userId: req.userId });
    return res.status(200).json({ preferences });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/preferences
const createPreference = async (req, res) => {
  try {
    const {
      label,
      roles,
      locations,
      experience,
      salaryRange,
      jobType,
      platforms,
      dailyApplyCap,
      standardAnswers,
    } = req.body;

    // 1. Validate roles and locations are non-empty arrays
    if (!Array.isArray(roles) || roles.length === 0 || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: 'At least one role and one location are required' });
    }

    // 2. Validate platforms only contains values from ["naukri", "indeed", "linkedin"]
    if (platforms !== undefined) {
      if (!Array.isArray(platforms) || platforms.some((p) => !ALLOWED_PLATFORMS.includes(p))) {
        return res.status(400).json({ error: 'Invalid platform specified. Allowed platforms: naukri, indeed, linkedin' });
      }
    }

    // 3. Validate dailyApplyCap is a number between 1 and 50
    const cap = dailyApplyCap !== undefined ? dailyApplyCap : 15;
    if (typeof cap !== 'number' || isNaN(cap) || cap < 1 || cap > 50) {
      return res.status(400).json({ error: 'Daily apply cap must be between 1 and 50' });
    }

    // 4. Create preference document with userId: req.userId attached server-side
    const preference = await Preference.create({
      userId: req.userId,
      label: label || 'Default Preference',
      roles,
      locations,
      experience: experience || '',
      salaryRange: salaryRange || '',
      jobType: jobType || '',
      platforms: platforms || ALLOWED_PLATFORMS,
      dailyApplyCap: cap,
      standardAnswers: standardAnswers || {},
    });

    return res.status(201).json({ preference });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /api/preferences/:id
const updatePreference = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Preference not found' });
    }

    const preference = await Preference.findById(id);
    if (!preference) {
      return res.status(404).json({ error: 'Preference not found' });
    }

    // Check authorization: preference.userId === req.userId
    if (preference.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this preference' });
    }

    const {
      label,
      roles,
      locations,
      experience,
      salaryRange,
      jobType,
      platforms,
      dailyApplyCap,
      standardAnswers,
    } = req.body;

    // Apply same validation rules as POST for any fields present
    if (roles !== undefined && (!Array.isArray(roles) || roles.length === 0)) {
      return res.status(400).json({ error: 'At least one role and one location are required' });
    }

    if (locations !== undefined && (!Array.isArray(locations) || locations.length === 0)) {
      return res.status(400).json({ error: 'At least one role and one location are required' });
    }

    if (platforms !== undefined) {
      if (!Array.isArray(platforms) || platforms.some((p) => !ALLOWED_PLATFORMS.includes(p))) {
        return res.status(400).json({ error: 'Invalid platform specified. Allowed platforms: naukri, indeed, linkedin' });
      }
    }

    if (dailyApplyCap !== undefined) {
      if (typeof dailyApplyCap !== 'number' || isNaN(dailyApplyCap) || dailyApplyCap < 1 || dailyApplyCap > 50) {
        return res.status(400).json({ error: 'Daily apply cap must be between 1 and 50' });
      }
    }

    // Apply partial updates
    if (label !== undefined) preference.label = label;
    if (roles !== undefined) preference.roles = roles;
    if (locations !== undefined) preference.locations = locations;
    if (experience !== undefined) preference.experience = experience;
    if (salaryRange !== undefined) preference.salaryRange = salaryRange;
    if (jobType !== undefined) preference.jobType = jobType;
    if (platforms !== undefined) preference.platforms = platforms;
    if (dailyApplyCap !== undefined) preference.dailyApplyCap = dailyApplyCap;
    if (standardAnswers !== undefined) preference.standardAnswers = standardAnswers;

    await preference.save();

    return res.status(200).json({ preference });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPreferences,
  createPreference,
  updatePreference,
};

