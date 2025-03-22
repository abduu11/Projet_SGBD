const { getChatResponse } = require('../services/openRouterService');
const chatSave = require('../models/chatbotHistorique');
const db = require('../configs/db');

const sendMessage = async (req, res) => {
    const { message, id_examen, id_utilisateur } = req.body;

    if (!message || !id_examen || !id_utilisateur) {
        return res.status(400).json({ error: 'Paramètres manquants' });
    }

    try {
        // Vérifier si l'examen est corrigé
        const query = `
            SELECT c.note, c.statut, e.titre
            FROM Correction c
            JOIN Copie cp ON c.id_copie = cp.id
            JOIN Examen e ON cp.id_examen = e.id
            WHERE cp.id_examen = ? 
            AND cp.id_etudiant = ?
            AND c.statut = 'validé'
        `;

        db.query(query, [id_examen, id_utilisateur], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la vérification de l\'examen' });
            }

            // Récupérer l'historique des conversations
            const historyQuery = `
                SELECT question, reponse
                FROM Chatbot_Historique
                WHERE id_utilisateur = ?
                ORDER BY date_interaction DESC
                LIMIT 5
            `;

            db.query(historyQuery, [id_utilisateur], async (err, history) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
                }

                let prompt = '';
                
                if (results.length === 0) {
                    prompt = `L'étudiant n'a pas encore de note pour cet examen. 
                    Répondez poliment qu'il doit attendre la correction ou faire l'examen s'il ne l'a pas encore fait.`;
                } else {
                    const exam = results[0];
                    prompt = `L'étudiant a une note de ${exam.note}/20 pour l'examen "${exam.titre}". 
                    Vous pouvez répondre à ses questions en vous basant sur cette information.
                    Voici l'historique des conversations récentes : ${JSON.stringify(history)}.
                    Derniere indication ne repond jamais avec des emoji ou des symobole sinon je ne pourrais pas stocker ces reponses dans ma BD. Merci de repondre avec des mots et des phrases. Merci de ta comprehension. Question actuelle : ${message}`;
                }

                const chatResponse = await getChatResponse(prompt);
                
                // Sauvegarder l'interaction
                await new Promise((resolve, reject) => {
                    chatSave.saveChatbot(id_utilisateur, message, chatResponse.reponse, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                res.status(200).json(chatResponse);
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
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