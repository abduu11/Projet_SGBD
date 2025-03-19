const db = require("../configs/db");

const ChatBotHistorique = {
    saveChatbot: (id_user, questionUser, responseBot, callback) => {
        const query = "CALL SAVING_CHATBOT_Historique(?, ?, ?, @id_last)";
        db.query(query, [id_user, questionUser, responseBot], (err, result) => {
            if (err) {
                console.error("Erreur lors de la sauvegarde:", err);
                return callback(err);
            }
            db.query("SELECT @id_last AS id_inserted", (err, result) => {
                if (err) {
                    console.error("Erreur lors de la récupération de l'ID inséré:", err);
                    return callback(err);
                }
                callback(null, result[0].id_inserted);
            });
        });
    },

    getPreviousChats: (id_user, limit, callback) => {
        if (typeof id_user !== 'string' || typeof limit !== 'number') {
            return callback(new Error('Invalid parameters'));
        }

        const query = "SELECT question, reponse FROM Chatbot_Historique WHERE id_utilisateur = ? ORDER BY id DESC LIMIT ?";
        db.query(query, [id_user, limit], (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des échanges:", err);
                return callback(err);
            }
            callback(null, results);
        });
    }
};

module.exports = ChatBotHistorique;