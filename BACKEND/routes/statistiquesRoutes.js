const { getExamStats } = require('../controllers/statsController');

// Ajouter cette ligne avec les autres routes
router.get('/examens/:id/stats', getExamStats);
