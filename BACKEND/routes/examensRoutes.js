const express = require('express');
const router = express.Router();
const { createExamen, deleteExamen, getAllExamens } = require('../controllers/examController');
const upload = require('../configs/multer');

router.get('/examens', getAllExamens);

router.post('/examens', upload.single('fichier_pdf'), createExamen);

router.delete('/examens/:id', deleteExamen);

module.exports = router;