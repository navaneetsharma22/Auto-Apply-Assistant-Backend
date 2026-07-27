const express = require('express');
const { getSessions, initiateSession, deleteSession } = require('../controllers/sessionController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getSessions);
router.post('/:platform/initiate', initiateSession);
router.delete('/:platform', deleteSession);

module.exports = router;

