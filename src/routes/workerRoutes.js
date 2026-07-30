const express = require('express');
const router = express.Router();
const { triggerWorker } = require('../controllers/workerController');
const verifyToken = require('../middleware/verifyToken');

router.post('/trigger', verifyToken, triggerWorker);

module.exports = router;
