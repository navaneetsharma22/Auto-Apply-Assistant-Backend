const Job = require('../models/Job');

const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const { externalId, platform, title, company, location, salary, description, jobUrl, rawFormDetails } = req.body;
    
    const job = await Job.findOneAndUpdate(
      { externalId, platform },
      { title, company, location, salary, description, jobUrl, rawFormDetails },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  createJob,
};
