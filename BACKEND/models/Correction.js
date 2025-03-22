const db = require("../configs/db");

const Correction = {
    createCorrection: (correction, callback) => {
        const query = `UPDATE Examen SET corige_type = ? WHERE id = ?`;
        db.query(query, [correction.corrige_type, correction.id_examen], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    createCorrectionEnregistrement: (id_copie, note, commentaire, statut, id_enseignant_validateur, callback) => {
        const query = `SELECT * FROM Correction WHERE id_copie = ?`;
        db.query(query, [id_copie], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            if (result.length > 0) {
                return callback(new Error("L'étudiant a déjà une correction"), null);
            }
            const query = `INSERT INTO Correction (id_copie, note, commentaires, statut, id_enseignant_validateur) VALUES (?, ?, ?, ?, ?);`;
            db.query(query, [id_copie, parseInt(note), commentaire, 'validé', id_enseignant_validateur], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
        });
        
    },

    updateCorrection: (id_copie, note, callback) => {
        const query = `UPDATE Correction SET note = ? WHERE id_copie = ?`;
        db.query(query, [note, id_copie], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    getCorrectionByCopie: (id_copie, callback) => {
        const query = `SELECT * FROM Correction WHERE id_copie = ?`;
        db.query(query, [id_copie], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    getCorrectionByExamen: (id_examen, callback) => {
        const query = `SELECT * FROM Correction WHERE id_examen = ?`;
        db.query(query, [id_examen], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);  
        });
    },

    getCorrectionByEnseignant: (id_enseignant, callback) => {
        const query = `SELECT * FROM Correction WHERE id_enseignant_validateur = ?`;
        db.query(query, [id_enseignant], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    }
};
module.exports = Correction;