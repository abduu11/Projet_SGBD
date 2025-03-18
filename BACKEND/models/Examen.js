const db = require("../configs/db");

const Examen = {
    getAllExams: (callback) => {
        const query = "SELECT * FROM Examen ORDER BY date_creation DESC";
        db.query(query, (err, result) => {
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
        
        const query = `
        INSERT INTO Examen (titre, description, id_enseignant, fichier_pdf)
        VALUES (?, ?, ?, ?)
        `;

        const values = [titre, description, id_enseignant, fichier_pdf];

        db.query(query, values, (err, results) => {
        if (err) {
            console.error("Erreur lors de la création de l'examen", err);
            return callback(err, null);
        }
        console.log("Examen créé avec succès", results);
        return callback(null, results);
    });
    }
};

module.exports = Examen;