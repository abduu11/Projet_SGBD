const express = require('express');
const router = express.Router();
const { detecterPlagiatParExamen, genererRapportPDF } = require('../controllers/plagiatController');

router.get('/examens/:id/plagiat', detecterPlagiatParExamen);
router.get('/examens/:id/plagiat/rapport', genererRapportPDF);

module.exports = router;