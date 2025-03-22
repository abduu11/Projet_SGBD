const { getExamStats, getStatsEtudiant } = require('../controllers/statistiquesController');
const express = require('express');
const router = express.Router();

// Ajouter cette ligne avec les autres routes
router.get('/examens/:id/stats', getExamStats);
router.get('/:id/:idEnseignant', getStatsEtudiant);

module.exports = router;