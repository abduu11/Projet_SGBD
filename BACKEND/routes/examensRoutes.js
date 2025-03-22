const express = require('express');
const router = express.Router();
const { createExamen, deleteExamen, getAllExamens, getExamsForStudent, getEnseignants, generateCorrectionType } = require('../controllers/examController');
const upload = require('../configs/multer');
const { analyseCopie } = require('../services/correctionService');
const { corrigerCopie, validerCorrection, getCorrection } = require('../controllers/correctionController');
const { getExamStats } = require('../controllers/statistiquesController');

router.get('/examens/:id', getAllExamens);
router.get('/examens/etudiant/:id', getExamsForStudent);
router.get('/enseignants', getEnseignants);
router.get('/examens/:id/stats', getExamStats);


router.post('/examens', upload.single('fichier_pdf'), createExamen);
router.post('/examens/generer-corrigeType', generateCorrectionType);
router.post('/examens/corriger-copie', corrigerCopie);
router.put('/examens/valider-correction/:id', validerCorrection);
router.get('/examens/get-correction/:id', getCorrection);

router.delete('/examens/:id', deleteExamen);

module.exports = router;