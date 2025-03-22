const express = require('express');
const router = express.Router();
const { createExamen, deleteExamen, getAllExamens, getExamsForStudent, getEnseignants, generateCorrectionType } = require('../controllers/examController');
const { corrigerCopie, validerCorrection, getCorrectionsByExamen } = require('../controllers/correctionController');
const upload = require('../configs/multer');

// Routes existantes
router.get('/examens/:id', getAllExamens);
router.get('/examens/etudiant/:id', getExamsForStudent);
router.get('/enseignants', getEnseignants);
router.post('/examens', upload.single('fichier_pdf'), createExamen);
router.post('/examens/generer-corrigeType', generateCorrectionType);
router.delete('/examens/:id', deleteExamen);

// Nouvelles routes pour la correction
router.post('/correction/automatique', corrigerCopie);
router.put('/correction/:id/valider', validerCorrection);
router.get('/correction/examen/:id', getCorrectionsByExamen);

module.exports = router; 