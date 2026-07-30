const { runFullCycle } = require('../../../job-auto-apply-worker/src/scheduler');

const triggerWorker = async (req, res) => {
  try {
    // Run worker cycle asynchronously
    runFullCycle().catch((err) => {
      console.error('Worker cycle background error:', err);
    });

    return res.status(202).json({
      message: 'Worker search triggered! Fetching real job listings from connected platforms...',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to trigger worker search' });
  }
};

module.exports = { triggerWorker };
