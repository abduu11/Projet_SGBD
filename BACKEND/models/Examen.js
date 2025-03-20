const db = require("../configs/db");

const Examen = {

    getAllExams: (id_enseignant, callback) => {
        const query = "SELECT * FROM Examen WHERE id_enseignant = ? ORDER BY date_creation DESC";
        db.query(query, [id_enseignant], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    deleteExam: (id_examen, callback) => {
        const query = 'DELETE FROM Examen WHERE id = ?';
        db.query(query, [id_examen], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    createExam: async (titre, description, id_enseignant, fichier_pdf, callback) => {
        const query = `INSERT INTO Examen (titre, description, id_enseignant, fichier_pdf) VALUES (?, ?, ?, ?)`;
        const values = [titre, description, id_enseignant, fichier_pdf];

        db.query(query, values, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        return callback(null, results);
    });
    },

    getExamsByStudent: (id_etudiant, callback) => {
        const query = `SELECT Examen.* FROM Examen WHERE Examen.id_enseignant IN ( SELECT Enseignant.id_enseignant FROM Etudiant JOIN Utilisateur ON Etudiant.id_utilisateur = Utilisateur.id_utilisateur JOIN Enseignant ON Utilisateur.id_utilisateur = Enseignant.id_utilisateur WHERE Etudiant.id_etudiant = ? )`;
        db.query(query, [id_etudiant], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    getPDFFile: (id_examen, callback) => {
        const query = `SELECT fichier_pdf FROM Examen WHERE id = ?`;
        db.query(query, [id_examen], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    }

};

module.exports = Examen;