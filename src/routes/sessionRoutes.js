const express = require('express');
const { getSessions, getPlatformProfileData, initiateSession, deleteSession } = require('../controllers/sessionController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getSessions);
router.get('/profile-data', getPlatformProfileData);
router.post('/:platform/initiate', initiateSession);
router.delete('/:platform', deleteSession);

module.exports = router;
