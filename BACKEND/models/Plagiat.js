const db = require('../configs/db');

const Plagiat = {

    createPlagiat: (data, callback) => {
        const sql = "INSERT INTO Plagiat (id_copie1, id_copie2, pourcentage_similarite) VALUES (?, ?, ?)";
        db.query(sql, [data.id_copie1, data.id_copie2, data.pourcentage_similarite], callback);
    },

    getAll: (callback) => {
        const sql = "SELECT * FROM Plagiat ORDER BY date_detection DESC;";
        db.query(sql, callback);
    }
};

module.exports = Plagiat;