const express = require('express');
const { getPreferences, createPreference, updatePreference } = require('../controllers/preferenceController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.use(verifyToken);

router.get('/', getPreferences);
router.post('/', createPreference);
router.put('/:id', updatePreference);

module.exports = router;

