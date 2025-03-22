const bcrypt = require('bcryptjs');
const db = require('../configs/db');

const updatePassword = async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;

    try {
        // Vérifier l'ancien mot de passe
        const query = 'SELECT mot_de_passe FROM Utilisateur WHERE id = ?';
        db.query(query, [id], async (err, results) => {
            if (err) {
                return res.status(500).json({ erreur: 'Erreur lors de la vérification du mot de passe' });
            }

            if (results.length === 0) {
                return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
            }

            const isValid = bcrypt.compareSync(currentPassword, results[0].mot_de_passe);
            if (!isValid) {
                return res.status(400).json({ erreur: 'Mot de passe actuel incorrect' });
            }

            // Hasher le nouveau mot de passe
            const hashedPassword = bcrypt.hashSync(newPassword, 10);

            // Mettre à jour le mot de passe
            const updateQuery = 'UPDATE Utilisateur SET mot_de_passe = ? WHERE id = ?';
            db.query(updateQuery, [hashedPassword, id], (err) => {
                if (err) {
                    return res.status(500).json({ erreur: 'Erreur lors de la mise à jour du mot de passe' });
                }
                res.json({ message: 'Mot de passe mis à jour avec succès' });
            });
        });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
};

const updateProfile = async (req, res) => {
    const { id, prenom, nom, email } = req.body;

    try {
        const query = 'UPDATE Utilisateur SET prenom = ?, nom = ?, email = ? WHERE id = ?';
        db.query(query, [prenom, nom, email, id], (err) => {
            if (err) {
                return res.status(500).json({ erreur: 'Erreur lors de la mise à jour du profil' });
            }
            res.json({ message: 'Profil mis à jour avec succès' });
        });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
};

const getUserInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT id, prenom, nom, email FROM Utilisateur WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ erreur: 'Erreur lors de la récupération des informations' });
            }

            if (results.length === 0) {
                return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
            }

            res.json(results[0]);
        });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur serveur' });
    }
};

module.exports = { updatePassword, updateProfile, getUserInfo };
