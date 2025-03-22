const db = require('../configs/db');

const getExamStats = async (req, res) => {
  const examId = req.params.id;

  try {
    const notes = await new Promise((resolve, reject) => {
      db.query(
        `SELECT c.note, c.commentaires, c.date_correction,
         cp.date_soumission,
         u.nom, u.prenom
         FROM Correction c 
         JOIN Copie cp ON c.id_copie = cp.id
         JOIN Utilisateur u ON cp.id_etudiant = u.id
         WHERE cp.id_examen = ? 
         AND c.statut = 'validé' 
         AND c.note IS NOT NULL`,
        [examId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (notes.length === 0) {
      return res.status(404).json({
        erreur: 'Aucune note corrigée et validée disponible pour cet examen'
      });
    }

    const notesValues = notes.map(n => n.note);
    
    const nombreEtudiants = notes.length;
    
    const somme = notesValues.reduce((a, b) => a + b, 0);
    const moyenne = somme / nombreEtudiants;
    
    const carresEcarts = notesValues.map(note => Math.pow(note - moyenne, 2));
    const moyenneCarresEcarts = carresEcarts.reduce((a, b) => a + b, 0) / nombreEtudiants;
    const ecartType = Math.sqrt(moyenneCarresEcarts);

    const reussites = notesValues.filter(note => note >= 10).length;
    const tauxReussite = (reussites / nombreEtudiants) * 100;

    const notesTriees = [...notesValues].sort((a, b) => a - b);
    const mediane = nombreEtudiants % 2 === 0
    ? (notesTriees[nombreEtudiants/2 - 1] + notesTriees[nombreEtudiants/2]) / 2
    : notesTriees[Math.floor(nombreEtudiants/2)];

    const distributionNotes = Array.from({ length: 21 }, (_, i) => ({
    note: i,
    nombre: notesValues.filter(n => n === i).length
    }));

    const tendances = analyserTendances(notes);

    const analyse = genererAnalyseDetaillee(notesValues, moyenne, ecartType, tauxReussite);

    await new Promise((resolve, reject) => {
    db.query(
        `INSERT INTO Statistiques (id_examen, moyenne, ecart_type, taux_reussite) 
        VALUES (?, ?, ?, ?)`,
        [examId, moyenne, ecartType, tauxReussite],
        (err) => {
        if (err) reject(err);
        else resolve();
        }
    );
    });

    res.json({
        moyenne,
        ecartType,
        tauxReussite,
      nombreEtudiants,
      noteMax: Math.max(...notesValues),
      noteMin: Math.min(...notesValues),
        mediane,
        distributionNotes,
        tendances,
        analyse
    });

  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    res.status(500).json({
      erreur: 'Erreur lors du calcul des statistiques',
      details: error.message
    });
  }
};

function analyserTendances(notes) {
  const tendanceTemporelle = calculerTendanceTemporelle(notes);
  
  const facteurs = analyserFacteursInfluence(notes);
  
  const prevision = calculerPrevision(notes);

  return {
    prevision,
    confiance: calculerNiveauConfiance(notes),
    facteurs,
    tendanceTemporelle
  };
}

function calculerTendanceTemporelle(notes) {
  const notesTriees = notes.sort((a, b) => 
    new Date(a.date_soumission) - new Date(b.date_soumission)
  );

  const tendance = notesTriees.slice(-5).reduce((acc, val, i) => {
    if (i === 0) return 0;
    return acc + (val.note - notesTriees[i-1].note);
  }, 0) / 4;

  return {
    direction: tendance > 0 ? 'amélioration' : 'détérioration',
    intensite: Math.abs(tendance),
    periode: '5 dernières soumissions'
  };
}

function analyserFacteursInfluence(notes) {
  const facteurs = [];

  const ordreSoumissionImpact = analyserImpactOrdreSoumission(notes);
  facteurs.push({
    nom: "Ordre de soumission",
    impact: ordreSoumissionImpact,
    description: "Impact de l'ordre de soumission des copies"
  });

  const qualiteCommentairesImpact = analyserQualiteCommentaires(notes);
  facteurs.push({
    nom: "Qualité des commentaires",
    impact: qualiteCommentairesImpact,
    description: "Impact de la qualité des commentaires des correcteurs"
  });

  const progressionImpact = analyserProgression(notes);
  facteurs.push({
    nom: "Progression",
    impact: progressionImpact,
    description: "Impact de la progression des étudiants"
  });

  return facteurs;
}

function analyserImpactOrdreSoumission(notes) {
  const notesTriees = notes.sort((a, b) => 
    new Date(a.date_soumission) - new Date(b.date_soumission)
  );
  
  const premiereMoitie = notesTriees.slice(0, Math.floor(notesTriees.length / 2));
  const deuxiemeMoitie = notesTriees.slice(Math.floor(notesTriees.length / 2));
  
  const moyennePremiere = premiereMoitie.reduce((acc, val) => acc + val.note, 0) / premiereMoitie.length;
  const moyenneDeuxieme = deuxiemeMoitie.reduce((acc, val) => acc + val.note, 0) / deuxiemeMoitie.length;
  
  return ((moyenneDeuxieme - moyennePremiere) / 20) * 100;
}

function analyserQualiteCommentaires(notes) {
  const commentairesValides = notes.filter(n => n.commentaires && n.commentaires.length > 0);
  const moyenneCommentaires = commentairesValides.reduce((acc, val) => acc + val.note, 0) / commentairesValides.length;
  const moyenneGenerale = notes.reduce((acc, val) => acc + val.note, 0) / notes.length;
  
  return ((moyenneCommentaires - moyenneGenerale) / 20) * 100;
}

function analyserProgression(notes) {
  const notesTriees = notes.sort((a, b) => 
    new Date(a.date_soumission) - new Date(b.date_soumission)
  );
  
  const progression = notesTriees.slice(-3).reduce((acc, val, i) => {
    if (i === 0) return 0;
    return acc + (val.note - notesTriees[i-1].note);
  }, 0) / 2;
  
  return (progression / 20) * 100;
}

function calculerPrevision(notes) {
  const tendanceTemporelle = calculerTendanceTemporelle(notes);
  const derniereNote = notes[notes.length - 1].note;
  
  const prevision = derniereNote + (tendanceTemporelle.direction === 'amélioration' 
    ? tendanceTemporelle.intensite 
    : -tendanceTemporelle.intensite);

  return Math.min(20, Math.max(0, prevision));
}

function calculerNiveauConfiance(notes) {
  const notesValues = notes.map(n => n.note);
  const ecartType = calculerEcartType(notesValues);
  const nombreNotes = notes.length;
  
  const confianceBase = 100 - (ecartType * 5);
  const confianceNombre = Math.min(100, nombreNotes * 10);
  
  return (confianceBase + confianceNombre) / 2;
}

function calculerEcartType(notes) {
  const moyenne = notes.reduce((a, b) => a + b, 0) / notes.length;
  const carresEcarts = notes.map(note => Math.pow(note - moyenne, 2));
  const moyenneCarresEcarts = carresEcarts.reduce((a, b) => a + b, 0) / notes.length;
  return Math.sqrt(moyenneCarresEcarts);
}

function genererAnalyseDetaillee(notes, moyenne, ecartType, tauxReussite) {
  const niveau = determinerNiveauPerformance(moyenne);
  const commentaire = genererCommentaire(moyenne, ecartType, tauxReussite);
  const recommandations = genererRecommandations(notes, moyenne, ecartType, tauxReussite);

  return {
    niveau,
    commentaire,
    recommandations
  };
}

function determinerNiveauPerformance(moyenne) {
  if (moyenne >= 15) return "Excellent";
  if (moyenne >= 12) return "Bon";
  if (moyenne >= 10) return "Satisfaisant";
  return "À améliorer";
}

function genererCommentaire(moyenne, ecartType, tauxReussite) {
  let commentaire = "L'analyse des résultats montre que ";
  
  if (moyenne >= 15) {
    commentaire += "les performances sont excellentes, avec une moyenne élevée de " + moyenne.toFixed(2) + "/20. ";
  } else if (moyenne >= 12) {
    commentaire += "les performances sont bonnes, avec une moyenne de " + moyenne.toFixed(2) + "/20. ";
  } else if (moyenne >= 10) {
    commentaire += "les performances sont satisfaisantes, avec une moyenne de " + moyenne.toFixed(2) + "/20. ";
  } else {
    commentaire += "les performances nécessitent une attention particulière, avec une moyenne de " + moyenne.toFixed(2) + "/20. ";
  }

  commentaire += `Le taux de réussite est de ${tauxReussite.toFixed(2)}% et l'écart-type de ${ecartType.toFixed(2)}. `;
  
  if (ecartType > 4) {
    commentaire += "La dispersion des notes est importante, suggérant des différences significatives dans la préparation des étudiants.";
  } else {
    commentaire += "La dispersion des notes est relativement homogène, indiquant une préparation similaire des étudiants.";
  }

  return commentaire;
}

function genererRecommandations(notes, moyenne, ecartType, tauxReussite) {
  const recommandations = [];

  if (moyenne < 10) {
    recommandations.push("Renforcer le soutien pédagogique pour les étudiants en difficulté");
  }
  if (ecartType > 4) {
    recommandations.push("Mettre en place des sessions de révision groupées");
  }
  if (tauxReussite < 70) {
    recommandations.push("Revoir la difficulté des exercices et adapter le niveau");
  }

  const distribution = notes.reduce((acc, note) => {
    acc[note] = (acc[note] || 0) + 1;
    return acc;
  }, {});

  const notesFaibles = Object.entries(distribution)
    .filter(([note, count]) => note < 10 && count > 2)
    .length;

  if (notesFaibles > 0) {
    recommandations.push("Identifier et accompagner les étudiants ayant des difficultés récurrentes");
  }

  recommandations.push("Organiser des sessions de feedback avec les étudiants avec les faibles notes pour les examens prochains");
  recommandations.push("Proposer des exercices d'entraînement supplémentaires");

  return recommandations;
}

module.exports = { getExamStats };
