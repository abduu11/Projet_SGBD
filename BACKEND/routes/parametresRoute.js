const express = require('express');
const router = express.Router();
const { updatePassword, updateProfile, getUserInfo } = require('../controllers/parametresController');

router.get('/:id', getUserInfo);
router.post('/password', updatePassword);
router.post('/profile', updateProfile);

module.exports = router;
