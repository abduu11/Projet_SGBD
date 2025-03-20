const express = require('express');
const router = express.Router();
const { createExamen, deleteExamen, getAllExamens, getExamsForStudent, getEnseignants, generateCorrectionType } = require('../controllers/examController');
const upload = require('../configs/multer');

router.get('/examens/:id', getAllExamens);
router.get('/examens/etudiant/:id', getExamsForStudent);
router.get('/enseignants', getEnseignants);


router.post('/examens', upload.single('fichier_pdf'), createExamen);
router.post('/examens/generer-corrigeType', generateCorrectionType);

router.delete('/examens/:id', deleteExamen);

module.exports = router;