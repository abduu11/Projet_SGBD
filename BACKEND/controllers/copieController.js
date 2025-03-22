const Copie = require('../models/Copie');
const fs = require('fs');
const path = require('path');

const submitCopie = (req, res) => {

    const { id_etudiant, id_examen } = req.body;
    const fichier_pdf = req.file?.filename || null;

    if (!id_etudiant || !id_examen || !fichier_pdf) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    Copie.checkIfSubmitted(id_etudiant, id_examen, (err, result) => {
        if (err) {
            console.log("Erreur: ", err);
            const filePath = path.join(__dirname, '../uploads', fichier_pdf);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(500).json({ message: "Erreur lors de la verification de la soumission de la copie" });
        }
        if (result.length > 0) {
            const filePath = path.join(__dirname, '../uploads', fichier_pdf);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return res.status(400).json({ message: "Vous avez deja soumis une copie pour cet examen" });
        } else {Copie.submitForAnExam(id_etudiant, id_examen, fichier_pdf, (err, result) => {
            if (err) {
                console.log("Erreur: ",err);
                return res.status(500).json({ message: "Erreur lors de la soummission de la copie"});
            }
            console.log(result);
            return res.status(200).json({ message: "Copie soumise avec succes" });
        });
    }
    });

};

const deleteCopie = (req, res) => {
    const { id_etudiant, id_examen } = req.body;

    let fichier_pdf;

    if (!id_etudiant || !id_examen) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    Copie.getPdf(id_etudiant, id_examen, (err, result) => {
        if (err) {
            console.log("Erreur: ", err);
            return res.status(500).json({ message: "Erreur lors de la recuperation du fichier pdf" });
        }
        if (!result || result.length === 0) {
            return res.status(400).json({ message: "Aucune copie trouvee" });
        }
        fichier_pdf = result[0].fichier_pdf;
        
        const filePath = path.join(__dirname, '../uploads', fichier_pdf);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                let dirPath = path.dirname(filePath);
                while (dirPath !== path.join(__dirname, '../uploads')) {
                    if (fs.readdirSync(dirPath).length === 0) {
                        fs.rmdirSync(dirPath);
                        dirPath = path.dirname(dirPath);
                    } else {
                        break;
                    }
                }
            } catch (error) {
                console.log("Erreur lors de la suppression du fichier:", error);
                return res.status(500).json({ message: "Erreur lors de la suppression du fichier" });
            }
        }

        Copie.canceledSubmit(id_etudiant, id_examen, (err, result) => {
            if (err) {
                console.log("Erreur: ", err);
                return res.status(500).json({ message: "Erreur lors de la suppression de la copie" });
            }
            return res.status(200).json({ message: "Copie supprimee avec succes" });
        });
    });
};

const addComment = (req, res) => {

    const { id_etudiant, id_examen, commentaire } = req.body;

    if (!id_etudiant || !id_examen || !commentaire) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (commentaire.includes("'") || commentaire.includes(";")) {
        return res.status(400).json({ message: "Le commentaire ne doit pas contenir de ' ou ;" });
    }

    if (typeof commentaire !== 'string') {
        return res.status(400).json({ message: "Le commentaire doit etre une chaine de caracteres" });
    }

    Copie.checkIfSubmitted(id_etudiant, id_examen, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la verification de la soumission de la copie" });
        }
        if (result.length === 0) {
            return res.status(400).json({ message: "Vous n'avez pas de soumission pour cet examen" });
        }
        Copie.addComment(id_etudiant, id_examen, commentaire, (err, result) => {
            if (err) {
                console.log("Erreur: ", err);
                return res.status(500).json({ message: "Erreur lors de l'ajout du commentaire" });
            }
            return res.status(200).json({ message: "Commentaire ajoute avec succes" });
        });
    });

};

const getExamenByEnseignant = (req, res) => {
    const { id_enseignant } = req.body;

    Copie.getExamenByEnseignant(id_enseignant, (err, result) => {
        if (err) {
            console.log("Erreur: ", err);
            return res.status(500).json({ message: "Erreur lors de la recuperation des examens" });
        }
        return res.status(200).json(result);
    });
};

const getAllCopies = (req, res) => {
    const { id_examen } = req.body;

    Copie.getAllCopies(id_examen, (err, result) => {
        if (err) {
            console.log("Erreur: ", err);
            return res.status(500).json({ message: "Erreur lors de la recuperation des copies" });
        }
        return res.status(200).json(result);
    });
};

module.exports = { submitCopie, deleteCopie, addComment, getAllCopies, getExamenByEnseignant };