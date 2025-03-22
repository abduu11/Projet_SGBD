const db = require("../configs/db");

const Correction = {
    createCorrection: (correction, callback) => {
        const query = `INSERT INTO Correction (id_examen, id_copie, note, commentaire, statut) VALUES (?, ?, ?, ?, ?)`;
        db.query(query, [
            correction.id_examen,
            correction.id_copie,
            correction.note,
            correction.commentaire,
            correction.statut
        ], (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result.insertId);
        });
    },

    updateCorrection: (id, correction, callback) => {
        const query = `UPDATE Correction SET note = ?, commentaire = ?, statut = ? WHERE id = ?`;
        db.query(query, [correction.note, correction.commentaire, correction.statut, id], callback);
    },

    getCorrectionsByExamen: (id_examen, callback) => {
        const query = `SELECT * FROM Correction WHERE id_examen = ?`;
        db.query(query, [id_examen], callback);
    },

    getCorrectionByCopie: (id_copie, callback) => {
        const query = `SELECT * FROM Correction WHERE id_copie = ?`;
        db.query(query, [id_copie], callback);
    }
};

module.exports = Correction; 