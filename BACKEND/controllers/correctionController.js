const { analyserCopie, sendACorrectionAI } = require('../services/correctionService');
const Correction = require('../models/Correction');
const fs = require('fs');
const path = require('path');

const corrigerCopie = async (req, res) => {
    try {
        const { id_examen, id_copie, fichier_pdf } = req.body;

        if (!id_examen || !id_copie || !fichier_pdf) {
            return res.status(400).json({
                message: "Paramètres manquants",
                details: "id_examen, id_copie et fichier_pdf sont requis"
            });
        }

        // Analyser la copie
        const resultatAnalyse = await analyserCopie(id_examen, fichier_pdf);

        // Créer une nouvelle correction
        const nouvelleCorrection = {
            id_examen,
            id_copie,
            note: resultatAnalyse.note,
            commentaire: resultatAnalyse.commentaire,
            statut: 'proposee'
        };

        Correction.createCorrection(nouvelleCorrection, (err, correctionId) => {
            if (err) {
                console.error("Erreur lors de la création de la correction:", err);
                return res.status(500).json({
                    message: "Erreur lors de la création de la correction",
                    details: err.message
                });
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
        return res.status(500).json({
            message: error.message || "Erreur lors de la correction automatique",
            details: error.stack
        });
    }
};

const validerCorrection = async (req, res) => {
    const { id_correction } = req.params;
    const { note, commentaire } = req.body;

    if (!id_correction || !note || !commentaire) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        Correction.updateCorrection(id_correction, { note, commentaire, status: 'validee' }, (err, correction) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la validation de la correction' });
            }
            res.json({
                message: 'Correction validee avec succes',
                correction: correction
            });
        });
    } catch (error) {
        console.error('Erreur lors de la validation de la correction:', error);
        res.status(500).json({ error: 'Erreur lors de la validation de la correction' });
    }
};

const getCorrection = async (req, res) => {
    const { id_examen } = req.params;

    try {
        Correction.getCorrection(id_examen, (err, correction) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la recuperation de la correction' });
            }
            res.json(correction);
        });
    } catch (error) {
        console.error('Erreur lors de la recuperation de la correction:', error);
        res.status(500).json({ error: 'Erreur lors de la recuperation de la correction' });
    }
};

const enregistrerCorrection = async (req, res) => {
    const { id_copie,note, commentaire, id_enseignant_validateur } = req.body;

    const statut = 'proposee';

    console.log(id_copie, note, commentaire, id_enseignant_validateur);

    if (!id_copie || !note || !commentaire || !id_enseignant_validateur) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        Correction.createCorrectionEnregistrement(id_copie, note, commentaire, statut, id_enseignant_validateur, (err, correction) => {  
            if (err) {
                console.error('Erreur lors de l\'enregistrement de la correction:', err);
                return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la correction' });
            }
            res.json({
                message: 'Correction enregistree avec succes',
                correction: correction
            });
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la correction:', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la correction' });
    }
};

const modifierCorrection = async (req, res) => {
    const { id_copie, note } = req.body;

    if (!id_copie || !note) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        Correction.updateCorrection(id_copie, note, (err, correction) => {
            if (err) {
                console.error('Erreur lors de la modification de la correction:', err);
                return res.status(500).json({ error: 'Erreur lors de la modification de la correction' });
            }
            res.json({
                message: 'Correction modifiee avec succes',
                correction: correction
            });
        });
    } catch (error) {
        console.error('Erreur lors de la modification de la correction:', error);
        res.status(500).json({ error: 'Erreur lors de la modification de la correction' });
    }
};




module.exports = { corrigerCopie, validerCorrection, getCorrection, enregistrerCorrection, modifierCorrection };