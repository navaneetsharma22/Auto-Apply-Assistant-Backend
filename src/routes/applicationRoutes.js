const express = require('express');
const { getApplications } = require('../controllers/applicationController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getApplications);

module.exports = router;

