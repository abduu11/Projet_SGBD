const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const natural = require('natural');
const sw = require('stopword');
const db = require('../configs/db');
const axios = require('axios');

const dossierCopies = path.join(__dirname, '..', 'uploads');
const pdfCache = new Map();

function calculerSimilarite(text1, text2) {
  // Nettoyage des textes
  const cleanText1 = text1.toLowerCase().replace(/[^\w\s]/gi, '').trim();
  const cleanText2 = text2.toLowerCase().replace(/[^\w\s]/gi, '').trim();

  // Création des tokens
  const tokens1 = cleanText1.split(/\s+/);
  const tokens2 = cleanText2.split(/\s+/);

  // Création des ensembles de mots uniques
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);

  // Calcul de l'intersection
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  // Calcul du coefficient de Jaccard
  const jaccardSimilarity = intersection.size / union.size;

  // Conversion en pourcentage
  const pourcentage = Math.round(jaccardSimilarity * 100);

  // Ajustement du pourcentage en fonction de la longueur des textes
  const longueurMin = Math.min(tokens1.length, tokens2.length);
  const longueurMax = Math.max(tokens1.length, tokens2.length);
  const ratioLongueur = longueurMin / longueurMax;

  // Ajustement final du pourcentage
  const pourcentageFinal = Math.round(pourcentage * ratioLongueur);

  console.log(`Debug - Text1: ${tokens1.join(', ')}`);
  console.log(`Debug - Text2: ${tokens2.join(', ')}`);
  console.log(`Debug - Intersection: ${[...intersection].join(', ')}`);
  console.log(`Debug - Union: ${[...union].join(', ')}`);
  console.log(`Debug - Score: ${pourcentageFinal}%`);

  return pourcentageFinal;
}

async function lirePDF(chemin) {
  if (pdfCache.has(chemin)) {
    return pdfCache.get(chemin);
  }

  try {
    const buffer = fs.readFileSync(chemin);
    const pdfData = await pdfParse(buffer, {
      max: 50,
      pagerender: function(pageData) {
        return pageData.getTextContent().then(function(textContent) {
          return textContent.items.map(item => item.str).join(' ');
        });
      }
    });
    
    const texte = pdfData.text.trim();
    if (!texte) {
      console.warn(`Le PDF ${chemin} est vide ou ne contient pas de texte`);
      return null;
    }
    
    pdfCache.set(chemin, texte);
    return texte;
  } catch (error) {
    console.error(`Erreur lors de la lecture du PDF ${chemin}:`, error);
    return null;
  }
}

function analyserCopiesForExam(examId, callback) {
  const sql = `SELECT c.*, u.nom, u.prenom FROM Copie c JOIN Utilisateur u ON c.id_etudiant = u.id WHERE c.id_examen = ?`;

  db.query(sql, [examId], async (err, copies) => {
    if (err) {
      console.error("Erreur lors de la récupération des copies:", err);
      return callback(err);
    }

    if (copies.length === 0) {
      console.log("Aucune copie trouvée pour cet examen");
      return callback(null, []);
    }

    try {
      console.log(`Début de l'analyse de ${copies.length} copies`);
      
      const resultats = [];
      
      for (const copie of copies) {
        try {
          const chemin = path.join(dossierCopies, copie.fichier_pdf);
          if (!fs.existsSync(chemin)) {
            console.warn(`Fichier non trouvé: ${chemin}`);
            continue;
          }
          
          const texte = await lirePDF(chemin);
          if (!texte) {
            console.warn(`Impossible de lire le PDF: ${chemin}`);
            continue;
          }

          console.log(`Texte extrait de ${chemin}: ${texte.substring(0, 100)}...`);
          resultats.push({
            id: copie.id,
            fichier: copie.fichier_pdf,
            texte,
            nom: copie.nom,
            prenom: copie.prenom
          });
        } catch (error) {
          console.error(`Erreur lors du traitement de la copie ${copie.id}:`, error);
        }
      }

      console.log(`Nombre de copies valides analysées: ${resultats.length}`);

      const rapports = [];
      for (let i = 0; i < resultats.length; i++) {
        for (let j = i + 1; j < resultats.length; j++) {
          const score = calculerSimilarite(resultats[i].texte, resultats[j].texte);
          console.log(`Similarité entre ${resultats[i].nom} et ${resultats[j].nom}: ${score}%`);
          
          if (score > 0) {
            rapports.push({
              id_copie1: resultats[i].id,
              id_copie2: resultats[j].id,
              pourcentage_similarite: score,
              etudiant1_nom: resultats[i].nom,
              etudiant1_prenom: resultats[i].prenom,
              etudiant2_nom: resultats[j].nom,
              etudiant2_prenom: resultats[j].prenom
            });
          }
        }
      }

      console.log(`Analyse terminée: ${rapports.length} rapports générés`);
      callback(null, rapports);

    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      callback(error);
    }
  });
}

async function genererRapport(rapports) {
  try {
    // Calcul des statistiques
    const nombreCas = rapports.length;
    const moyenneSimilarite = rapports.reduce((acc, curr) => acc + curr.pourcentage_similarite, 0) / nombreCas;
    const niveauPlagiat = moyenneSimilarite > 70 ? 'Élevé' : moyenneSimilarite > 40 ? 'Moyen' : 'Faible';

    // Génération du rapport
    const rapport = {
      resume: `Analyse de ${nombreCas} cas de plagiat détectés dans les copies.`,
      analyse: rapports.map(r => 
        `Similarité de ${r.pourcentage_similarite}% entre ${r.etudiant1_nom} ${r.etudiant1_prenom} et ${r.etudiant2_nom} ${r.etudiant2_prenom}`
      ).join('\n'),
      statistiques: {
        nombre_cas: nombreCas,
        moyenne_similarite: moyenneSimilarite,
        niveau_plagiat: niveauPlagiat
      },
      recommandations: [
        'Renforcer la sensibilisation sur le plagiat',
        'Organiser des sessions de formation sur la rédaction académique',
        'Mettre en place un système de détection automatique préventif'
      ],
      suggestions_sanctions: [
        'Avertissement pour les cas de plagiat faible',
        'Note réduite pour les cas de plagiat moyen',
        'Échec à l\'examen pour les cas de plagiat élevé'
      ]
    };

    return JSON.stringify(rapport);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw error;
  }
}

module.exports = { analyserCopiesForExam, genererRapport }; 