const express = require('express');
const { getApplications, updateApplicationApproval } = require('../controllers/applicationController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getApplications);
router.patch('/:applicationId/approval', updateApplicationApproval);

module.exports = router;
