const { getChatResponse } = require('../services/openRouterService');

const sendMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'message requiis' });
    }

    try {
        const chatResponse = await getChatResponse(message);
        res.status(200).json(chatResponse);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'chatBotError' });
    }
}

module.exports = { sendMessage };