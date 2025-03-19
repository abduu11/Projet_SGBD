const { getChatResponse } = require('../services/openRouterService');
const chatSave = require('../models/chatbotHistorique');

const sendMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'message requis' });
    }


    if (!message) {
        return res.status(400).json({ error: 'message requis' });
    }

    try {
        const chatResponse = await getChatResponse(message);
        res.status(200).json(chatResponse);
    } catch (err) {
        res.status(400).json({ error: 'chatBotError' });
    }
};

const saveChatHistorique = async (req, res) => {
    const { id_user, questionUser, responseBot } = req.body;

    if (!id_user || !questionUser || !responseBot) {
        return res.status(400).json({ error: 'il ya un ou plusieurs champs manquant' });
    }

    try {
        chatSave.saveChatbot(id_user, questionUser, responseBot, (err, result) => {
            if (err) {
                console.error("Erreur lors de la sauvegarde:", err);
                return res.status(500).json({ error: 'Erreur de sauvegarde' });
            }
            console.log(result);
            res.status(200).json({ message: 'Sauvegarde reussie', result });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erreur de sauvegarde' });
    }
};

const getPreviousChatsController = async (req, res) => {
    
    const { id_user, limit } = req.params;

    try {
        chatSave.getPreviousChats(id_user, parseInt(limit), (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des échanges:", err);
                return res.status(500).json({ error: 'Erreur lors de la récupération des échanges' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des échanges' });
    }
};

module.exports = { sendMessage, saveChatHistorique, getPreviousChatsController };