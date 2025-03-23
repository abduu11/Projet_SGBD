const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Compression des réponses
app.use(compression());

// Middleware de parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

// Configuration des fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1d',
    etag: true
}));

// Routes
const authentificationRoute = require('./routes/authentificationRoute');
const chatRoute = require('./routes/chatRoutes');
const examensRoute = require('./routes/examensRoutes');
const copieRoute = require('./routes/copieRoutes');
const correctionRoute = require('./routes/correctionRoutes');
const plagiatRoute = require('./routes/plagiatRoute');
const parametresRoute = require('./routes/parametresRoute');
const notesRoute = require('./routes/notesRoutes');
const statistiquesRoute = require('./routes/statistiquesRoutes');

// Application des routes
app.use('/api/authentification', authentificationRoute);
app.use('/api/chat', chatRoute);
app.use('/api', examensRoute);
app.use('/api', copieRoute);
app.use('/api', correctionRoute);
app.use('/api', plagiatRoute);
app.use('/api/parametres', parametresRoute);
app.use('/api/notes', notesRoute);
app.use('/api/statistiques', statistiquesRoute);

// Route de santé pour Kubernetes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Une erreur est survenue sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

// Démarrage du serveur
const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
    console.log('SIGTERM reçu. Arrêt gracieux du serveur...');
    server.close(() => {
        console.log('Serveur arrêté');
        process.exit(0);
    });
});