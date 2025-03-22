const express = require('express');
const upload = require('../configs/multer');
const { submitCopie, deleteCopie, addComment, getAllCopies, getExamenByEnseignant } = require('../controllers/copieController');

const router = express.Router();

router.post('/soumission', upload.single('fichier_pdf'), submitCopie);
router.post('/suppression-copie', deleteCopie);
router.post('/commentaire', addComment);
router.post('/copies', getAllCopies);
router.post('/examens/list', getExamenByEnseignant);
router.post('/examens/submissions', getAllCopies);

module.exports = router;