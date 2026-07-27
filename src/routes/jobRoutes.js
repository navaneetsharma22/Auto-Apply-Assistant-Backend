const express = require('express');
const { getJobs, approveJob, skipJob } = require('../controllers/jobController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getJobs);
router.post('/:id/approve', approveJob);
router.post('/:id/skip', skipJob);

module.exports = router;

