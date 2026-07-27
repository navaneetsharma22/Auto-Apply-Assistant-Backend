const express = require('express');
const { getJobs, createJob } = require('../controllers/jobController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getJobs);
router.post('/', createJob);

module.exports = router;
