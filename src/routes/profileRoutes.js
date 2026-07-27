const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getProfile);
router.put('/', updateProfile);

module.exports = router;
