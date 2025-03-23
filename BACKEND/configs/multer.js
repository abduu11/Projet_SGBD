const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Configuration des répertoires
const BASE_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const SUBDIRS = {
    COPIES: 'copies',
    RAPPORTS: 'rapports',
    TEMP: 'temp'
};

// Création des répertoires nécessaires
const ensureDirectories = () => {
    try {
        // Création du répertoire principal
        if (!fs.existsSync(BASE_UPLOAD_DIR)) {
            fs.mkdirSync(BASE_UPLOAD_DIR, { recursive: true });
        }

        // Création des sous-répertoires
        Object.values(SUBDIRS).forEach(dir => {
            const dirPath = path.join(BASE_UPLOAD_DIR, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la création des répertoires:', error);
        throw new Error('Impossible de créer les répertoires nécessaires');
    }
};

// Initialisation des répertoires
ensureDirectories();

// Génération d'un nom de fichier sécurisé
const generateSecureFilename = (originalname) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalname).toLowerCase();
    return `${timestamp}-${randomString}${extension}`;
};

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            // Détermination du sous-répertoire en fonction du type de fichier
            let subdir = SUBDIRS.COPIES;
            if (file.fieldname === 'rapport') {
                subdir = SUBDIRS.RAPPORTS;
            }

            const uploadPath = path.join(BASE_UPLOAD_DIR, subdir);
            
            // Vérification et création du répertoire si nécessaire
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        } catch (error) {
            cb(new Error('Erreur lors de la configuration du répertoire de destination'));
        }
    },
    filename: (req, file, cb) => {
        try {
            const secureFilename = generateSecureFilename(file.originalname);
            cb(null, secureFilename);
        } catch (error) {
            cb(new Error('Erreur lors de la génération du nom de fichier'));
        }
    }
});

// Filtre de fichiers
const fileFilter = (req, file, cb) => {
    try {
        // Vérification du type MIME
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
        }

        // Vérification de l'extension
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf') {
            return cb(new Error('Extension de fichier non autorisée'), false);
        }

        cb(null, true);
    } catch (error) {
        cb(new Error('Erreur lors de la validation du fichier'));
    }
};

// Configuration de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Un seul fichier à la fois
    }
});

// Middleware de gestion des erreurs Multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'Le fichier est trop volumineux. Taille maximum: 5MB'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Trop de fichiers. Maximum: 1 fichier'
            });
        }
    }
    return res.status(400).json({
        error: err.message || 'Une erreur est survenue lors du téléchargement du fichier'
    });
};

module.exports = upload;