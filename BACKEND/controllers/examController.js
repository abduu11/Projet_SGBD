const db = require("../configs/db");
const exam = require("../models/Examen");
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const getAllExamens = (req, res) => {
    const id_enseignant = req.params.id;
    exam.getAllExams(id_enseignant, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération des examens", error: err });
        }
        return res.status(200).json(result);
    });
};

const getEnseignants = (req, res) => {
    const query = `SELECT * FROM Utilisateur WHERE role = 'enseignant'`;
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération des enseignants", error: err });
        }
        return res.status(200).json(result);
    });
};

const getExamsForStudent = (req, res) => {
    const id_etudiant = req.params.id;
    const id_enseignant = req.query.id_enseignant;

    const query = `
        SELECT Examen.*
        FROM Examen
        WHERE Examen.id_enseignant = ?
        ORDER BY Examen.date_creation DESC
    `;
    db.query(query, [id_enseignant], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des examens', error: err });
        }
        return res.status(200).json(result);
    });
};

const createExamen = async (req, res) => {
    try {
        console.log(req.file, req.body); 

        const { titre, description, id_enseignant } = req.body;
        const fichier_pdf = req.file?.filename || null;

        if (!titre || !description || !id_enseignant || !fichier_pdf) {
            return res.status(400).json({ message: "Tous les champs sont requis !" });
        }

        if (isNaN(Number(id_enseignant))) {
            return res.status(400).json({ message: "ID enseignant invalide" });
        }

        exam.createExam(titre, description, id_enseignant, fichier_pdf, (err, result) => {
            if (err) {
                console.error("Erreur SQL :", err);
                return res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'examen." });
            }
            return res.status(201).json({ message: "Examen créé avec succès", examId: result });
        });

    } catch (error) {
        console.error("Erreur inattendue :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const deleteExamen = (req, res) => {
    const id_examen = req.params.id;

    const getFilePathQuery = 'SELECT fichier_pdf FROM Examen WHERE id = ?';
    db.query(getFilePathQuery, [id_examen], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Erreur lors de la récupération du fichier', error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Examen non trouvé' });
        }

        const fichier_pdf = result[0].fichier_pdf;
        const filePath = path.isAbsolute(fichier_pdf) ? fichier_pdf : path.join(__dirname, "..", "uploads", fichier_pdf);

        fs.exists(filePath, (exists) => {
            if (!exists) {
                console.log('Le fichier n\'existe pas:', filePath);
                return res.status(404).json({ message: 'Fichier non trouvé' });
            }

            const deleteQuery = 'DELETE FROM Examen WHERE id = ?';
            db.query(deleteQuery, [id_examen], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'examen', error: err });
                }

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Erreur lors de la suppression du fichier:', err);
                        return res.status(500).json({ message: 'Erreur lors de la suppression du fichier', error: err });
                    }
                    console.log('Fichier supprimé avec succès');
                    res.status(200).json({ message: 'Examen et fichier supprimés avec succès' });
                });
            });
        });
    });
};


module.exports = { createExamen, deleteExamen , getAllExamens, getExamsForStudent, getEnseignants };