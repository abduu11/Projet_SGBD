const express = require('express');
const { sendMessage } = require('../controllers/chatBotController');

const router = express.Router();

router.post('/', sendMessage);

module.exports = router;