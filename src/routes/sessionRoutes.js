const express = require('express');
const { saveSession, getSessionStatus } = require('../controllers/sessionController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.post('/', saveSession);
router.get('/status', getSessionStatus);

module.exports = router;
