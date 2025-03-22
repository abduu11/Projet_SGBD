const { analyserCopie } = require('../services/correctionService');
const Correction = require('../models/Correction');
const path = require('path');

const corrigerCopie = async (req, res) => {
    try {
        const { id_examen, id_copie, fichier_copie } = req.body;

        // Récupérer le chemin du corrigé type
        const corrigeTypePath = path.join(__dirname, `../uploads/corriges/corrige_${id_examen}.pdf`);
        const copiePath = path.join(__dirname, '../uploads', fichier_copie);

        // Analyser la copie avec l'IA
        const resultatAnalyse = await analyserCopie(copiePath, corrigeTypePath);

        // Créer une nouvelle correction
        const nouvelleCorrection = {
            id_examen,
            id_copie,
            note: resultatAnalyse.note,
            commentaire: JSON.stringify({
                general: resultatAnalyse.commentaire,
                points_forts: resultatAnalyse.points_forts,
                points_faibles: resultatAnalyse.points_faibles
            }),
            statut: 'proposee'
        };

        Correction.createCorrection(nouvelleCorrection, (err, correctionId) => {
            if (err) {
                console.error("Erreur lors de la création de la correction:", err);
                return res.status(500).json({ message: "Erreur lors de la création de la correction" });
            }

            return res.status(201).json({
                message: "Correction proposée avec succès",
                correction: {
                    id: correctionId,
                    ...nouvelleCorrection
                }
            });
        });
    } catch (error) {
        console.error("Erreur lors de la correction:", error);
        return res.status(500).json({ message: "Erreur lors de la correction automatique" });
    }
};

const validerCorrection = (req, res) => {
    const { id } = req.params;
    const { note, commentaire } = req.body;

    const correction = {
        note,
        commentaire,
        statut: 'validee'
    };

    Correction.updateCorrection(id, correction, (err, result) => {
        if (err) {
            console.error("Erreur lors de la validation de la correction:", err);
            return res.status(500).json({ message: "Erreur lors de la validation de la correction" });
        }

        return res.status(200).json({
            message: "Correction validée avec succès",
            correction: { id, ...correction }
        });
    });
};

const getCorrectionsByExamen = (req, res) => {
    const { id } = req.params;

    Correction.getCorrectionsByExamen(id, (err, corrections) => {
        if (err) {
            console.error("Erreur lors de la récupération des corrections:", err);
            return res.status(500).json({ message: "Erreur lors de la récupération des corrections" });
        }

        return res.status(200).json(corrections);
    });
};

module.exports = {
    corrigerCopie,
    validerCorrection,
    getCorrectionsByExamen
}; 