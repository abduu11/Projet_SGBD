const express = require('express');
const router = express.Router();
const { getNotesEtudiant } = require('../controllers/notesController');

router.get('/:id/:idEnseignant', getNotesEtudiant);

module.exports = router;
