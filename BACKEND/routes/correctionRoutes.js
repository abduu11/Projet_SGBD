const express = require('express');
const router = express.Router();
const { corrigerCopie, validerCorrection, getCorrection, enregistrerCorrection, modifierCorrection } = require('../controllers/correctionController');

router.post('/correction', corrigerCopie);
router.post('/enregistrer', enregistrerCorrection);
router.post('/modifier', modifierCorrection);

module.exports = router;
