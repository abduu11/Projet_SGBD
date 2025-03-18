const express = require('express');
const router = express.Router();
const { createExamen, deleteExamen, getAllExamens, getExamsForStudent, getEnseignants } = require('../controllers/examController');
const upload = require('../configs/multer');

router.get('/examens/:id', getAllExamens);
router.get('/examens/etudiant/:id', getExamsForStudent);
router.get('/enseignants', getEnseignants);


router.post('/examens', upload.single('fichier_pdf'), createExamen);

router.delete('/examens/:id', deleteExamen);

module.exports = router;