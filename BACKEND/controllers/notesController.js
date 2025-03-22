const db = require('../configs/db');

const getNotesEtudiant = async (req, res) => {
  const { id, idEnseignant } = req.params;

  try {
    const query = `
      SELECT 
        e.titre as matiere,
        c.note,
        c.date_correction,
        u.prenom as prenom_enseignant,
        u.nom as nom_enseignant,
        c.commentaires
      FROM Correction c
      JOIN Copie cp ON c.id_copie = cp.id
      JOIN Examen e ON cp.id_examen = e.id
      JOIN Utilisateur u ON c.id_enseignant_validateur = u.id
      WHERE cp.id_etudiant = ? 
      AND e.id_enseignant = ?
      AND c.statut = 'validé'
      ORDER BY c.date_correction DESC
    `;

    db.query(query, [id, idEnseignant], (err, notes) => {
      if (err) {
        return res.status(500).json({ erreur: 'Erreur lors de la récupération des notes' });
      }

      const moyenneGenerale = notes.length > 0
        ? notes.reduce((acc, note) => acc + note.note, 0) / notes.length
        : 0;

      res.json({
        notes,
        moyenneGenerale: parseFloat(moyenneGenerale.toFixed(2))
      });
    });
  } catch (error) {
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
};

module.exports = { getNotesEtudiant };
