const express = require('express');
const { sendMessage, saveChatHistorique} = require('../controllers/chatBotController');
const { getPreviousChatsController } = require('../controllers/chatBotController');

const router = express.Router();

router.post('/', sendMessage);
router.post('/save', saveChatHistorique);
router.get('/history/:id_user/:limit', getPreviousChatsController);

module.exports = router;