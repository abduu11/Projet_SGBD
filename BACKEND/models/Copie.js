const e = require('express');
const db = require('../configs/db');

const Copie = {

    getPdf: ( id_etudiant, id_examen, callback ) => {
        const query = "SELECT fichier_pdf FROM Copie WHERE id_etudiant = ? AND id_examen = ?;";
        db.query(query, [id_etudiant, id_examen], (err, result) => {
            return callback(err, result);
        });
    },

    checkIfSubmitted: ( id_etudiant, id_examen, callback ) => {
        const query = "SELECT * FROM Copie WHERE id_etudiant = ? AND id_examen = ?;";
        db.query(query, [id_etudiant, id_examen], (err, result) => {
            return callback(err, result);
        });
    },

    submitForAnExam: ( id_etudiant, id_examen, fichier_pdf, callback ) => {
        const query = "INSERT INTO Copie(fichier_pdf, id_etudiant, id_examen) VALUES (?, ?, ?);"
        db.query(query, [fichier_pdf ,id_etudiant, id_examen], (err, result) => {
            if (err) {
                console.log("Erreur: ", err);
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    canceledSubmit: ( id_etudiant, id_examen, callback ) => {
        const query = "DELETE FROM Copie WHERE id_etudiant = ? AND id_examen = ?;";
        db.query(query, [id_etudiant, id_examen], (err, result) => {
            if(err) {
                console.log("Erreur: ", err);
                return callback(err, null);
            }
            return(null, result);
        });
    },

    addComment: ( id_etudiant, id_examen, commentaire, callback ) => {
        const query = "UPDATE Copie SET commentaire = ? WHERE id_etudiant = ? AND id_examen = ?;";
        db.query(query, [commentaire, id_etudiant, id_examen], (err, result) => {
            if(err) {
                console.log("Erreur: ", err);
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    getAllCopies: (id_examen, callback) => {
        const query = "SELECT Copie.id, Copie.fichier_pdf, Copie.date_soumission, Copie.id_etudiant, Copie.id_examen, Copie.commentaire, Utilisateur.nom, Utilisateur.prenom, Utilisateur.email FROM Copie JOIN Utilisateur ON Copie.id_etudiant = Utilisateur.id WHERE id_examen = ?"
        db.query(query, [id_examen], (err, result) => {
            if(err) {
                console.log("Erreur: ", err);
                return callback(err, null);
            }
            return callback(null, result);
        });
    },

    getExamenByEnseignant: (id_enseignant, callback) => {
        const query = "SELECT * FROM Examen WHERE id_enseignant = ?;";
        db.query(query, [id_enseignant], (err, result) => {
            if(err) {
                console.log("Erreur: ", err);
                return callback(err, null);
            }
            return callback(null, result);
        });
    }

}

module.exports = Copie;