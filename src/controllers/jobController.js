const mongoose = require('mongoose');
const Job = require('../models/Job');

const ALLOWED_STATUSES = ['new', 'queued', 'approved', 'applied', 'skipped'];

// GET /api/jobs?status=queued
const getJobs = async (req, res) => {
  try {
    const status = req.query.status || 'queued';

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status filter' });
    }

    const jobs = await Job.find({ userId: req.userId, status }).sort({ createdAt: -1 });
    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/jobs/:id/approve
const approveJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.userId && job.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to modify this job' });
    }

    if (job.status !== 'queued') {
      return res.status(409).json({ error: 'Job is not in a queued state' });
    }

    job.status = 'approved';
    job.approvedAt = new Date();
    await job.save();

    return res.status(200).json({ job });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/jobs/:id/skip
const skipJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.userId && job.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to modify this job' });
    }

    if (job.status !== 'queued') {
      return res.status(409).json({ error: 'Job is not in a queued state' });
    }

    job.status = 'skipped';
    job.skippedAt = new Date();
    await job.save();

    return res.status(200).json({ job });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getJobs,
  approveJob,
  skipJob,
};

