const express = require('express');
const { getPreferences, updatePreferences } = require('../controllers/preferenceController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getPreferences);
router.put('/', updatePreferences);

module.exports = router;
