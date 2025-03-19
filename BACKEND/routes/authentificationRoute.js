const express = require('express');
const router = express.Router();
const authentificationController = require('../controllers/authentificationController');
const authentificationMiddleware = require('../middlewares/authentificationMiddleware');

//Route pour l'inscription
router.post('/inscription', authentificationController.inscription);

//Route pour la connexion
router.post('/connexion', authentificationController.connexion);

//Routes pour reinitialiser le mot de passe
router.post('/reinitialisation', authentificationController.reinitialisationMDP);
router.put('/mise-a-jour-mdp', authentificationController.misajourMDP);

module.exports = router;