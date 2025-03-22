const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const natural = require('natural');
const sw = require('stopword');
const db = require('../configs/db');
const axios = require('axios');

const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API;
const OPEN_ROUTER_API_KEY2 = process.env.OPEN_ROUTER_API2;
const OPEN_ROUTER_API_KEY3 = process.env.OPEN_ROUTER_API3;
const OPEN_ROUTER_API_KEY4 = process.env.OPEN_ROUTER_API4;
const OPEN_ROUTER_API_KEY5 = process.env.OPEN_ROUTER_API5;
const OPEN_ROUTER_API_KEY6 = process.env.OPEN_ROUTER_API6;
const OPEN_ROUTER_API_KEY7 = process.env.OPEN_ROUTER_API7;
const OPEN_ROUTER_API_KEY8 = process.env.OPEN_ROUTER_API8;
const OPEN_ROUTER_API_KEY9 = process.env.OPEN_ROUTER_API9;
const OPEN_ROUTER_API_KEY10 = process.env.OPEN_ROUTER_API10;
const OPEN_ROUTER_API_KEY11 = process.env.OPEN_ROUTER_API11;
const OPEN_ROUTER_API_KEY12 = process.env.OPEN_ROUTER_API12;
const OPEN_ROUTER_API_KEY13 = process.env.OPEN_ROUTER_API13;
const OPEN_ROUTER_API_KEY14 = process.env.OPEN_ROUTER_API14;
const OPEN_ROUTER_API_KEY15 = process.env.OPEN_ROUTER_API15;
const OPEN_ROUTER_API_KEY16 = process.env.OPEN_ROUTER_API16;
const OPEN_ROUTER_API_KEY17 = process.env.OPEN_ROUTER_API17;
const OPEN_ROUTER_API_KEY18 = process.env.OPEN_ROUTER_API18;
const OPEN_ROUTER_API_KEY19 = process.env.OPEN_ROUTER_API19;
const OPEN_ROUTER_API_KEY20 = process.env.OPEN_ROUTER_API20;
const OPEN_ROUTER_API_KEY21 = process.env.OPEN_ROUTER_API21;
const OPEN_ROUTER_API_KEY22 = process.env.OPEN_ROUTER_API22;
const OPEN_ROUTER_API_KEY23 = process.env.OPEN_ROUTER_API23;
const OPEN_ROUTER_API_KEY24 = process.env.OPEN_ROUTER_API24;
const OPEN_ROUTER_API_KEY25 = process.env.OPEN_ROUTER_API25;

const API_tab = [
    OPEN_ROUTER_API_KEY,
    OPEN_ROUTER_API_KEY2,
    OPEN_ROUTER_API_KEY3,
    OPEN_ROUTER_API_KEY4,
    OPEN_ROUTER_API_KEY5,
    OPEN_ROUTER_API_KEY6,
    OPEN_ROUTER_API_KEY7,
    OPEN_ROUTER_API_KEY8,
    OPEN_ROUTER_API_KEY9,
    OPEN_ROUTER_API_KEY10,
    OPEN_ROUTER_API_KEY11,
    OPEN_ROUTER_API_KEY12,
    OPEN_ROUTER_API_KEY13,
    OPEN_ROUTER_API_KEY14,
    OPEN_ROUTER_API_KEY15,
    OPEN_ROUTER_API_KEY16,
    OPEN_ROUTER_API_KEY17,
    OPEN_ROUTER_API_KEY18,
    OPEN_ROUTER_API_KEY19,
    OPEN_ROUTER_API_KEY20,
    OPEN_ROUTER_API_KEY21,
    OPEN_ROUTER_API_KEY22,
    OPEN_ROUTER_API_KEY23,
    OPEN_ROUTER_API_KEY24,
    OPEN_ROUTER_API_KEY25,
];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const API_KEY = getRandomElement(API_tab);

const dossierCopies = path.join(__dirname, '..', 'uploads');

const pdfCache = new Map();

function nettoyerTexte(texte) {
  const tokens = texte.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
  return sw.removeStopwords(tokens).join(' ');
}

function calculerSimilarite(text1, text2) {
  const tfidf = new natural.TfIdf();
  const cleanText1 = nettoyerTexte(text1);
  const cleanText2 = nettoyerTexte(text2);

  tfidf.addDocument(cleanText1);
  tfidf.addDocument(cleanText2);

  const vec1 = [];
  const vec2 = [];

  tfidf.listTerms(0).forEach(item => {
    vec1.push(item.tfidf);
    const termInDoc2 = tfidf.tfidf(item.term, 1);
    vec2.push(termInDoc2);
  });

  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val, i) => sum + vec2[i] * vec2[i], 0));
  const similarity = dotProduct / (magnitude1 * magnitude2 || 1);

  return similarity;
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
    
    pdfCache.set(chemin, pdfData.text);
    return pdfData.text;
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
      return callback(null, []);
    }

    try {
      console.log(`Début de l'analyse de ${copies.length} copies`);
      
      const batchSize = 5;
      const resultats = [];
      
      for (let i = 0; i < copies.length; i += batchSize) {
        const batch = copies.slice(i, i + batchSize);
        console.log(`Traitement du lot ${i/batchSize + 1}/${Math.ceil(copies.length/batchSize)}`);
        
        const batchResults = await Promise.all(
          batch.map(async copie => {
            try {
              const chemin = path.join(dossierCopies, copie.fichier_pdf);
              if (!fs.existsSync(chemin)) {
                console.warn(`Fichier non trouvé: ${chemin}`);
                return null;
              }
              
              const texte = await lirePDF(chemin);
              if (!texte) {
                console.warn(`Impossible de lire le PDF: ${chemin}`);
                return null;
              }

              return {
                id: copie.id,
                fichier: copie.fichier_pdf,
                texte,
                nom: copie.nom,
                prenom: copie.prenom
              };
            } catch (error) {
              console.error(`Erreur lors du traitement de la copie ${copie.id}:`, error);
              return null;
            }
          })
        );

        resultats.push(...batchResults.filter(r => r !== null));
      }

      const rapports = [];
      for (let i = 0; i < resultats.length; i++) {
        for (let j = i + 1; j < resultats.length; j++) {
          const score = calculerSimilarite(resultats[i].texte, resultats[j].texte);
          const pourcentage = parseFloat((score * 100).toFixed(2));
          
          rapports.push({
            id_copie1: resultats[i].id,
            id_copie2: resultats[j].id,
            pourcentage_similarite: pourcentage,
            etudiant1_nom: resultats[i].nom,
            etudiant1_prenom: resultats[i].prenom,
            etudiant2_nom: resultats[j].nom,
            etudiant2_prenom: resultats[j].prenom
          });
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

setInterval(() => {
  pdfCache.clear();
}, 1800000); 

const genererRapport = async (rapports) => {
  try {
    const prompt = `En tant qu'expert en détection de plagiat, analysez les données suivantes et générez un rapport détaillé.

Données des cas de plagiat détectés :
${JSON.stringify(rapports, null, 2)}

Veuillez fournir un rapport structuré au format JSON suivant (sans backticks ni marqueurs de code) :
{
    "resume": "Résumé général de la situation",
    "analyse": "Analyse détaillée des cas de plagiat",
    "statistiques": {
        "nombre_cas": ${rapports.length},
        "moyenne_similarite": ${rapports.reduce((acc, r) => acc + r.pourcentage_similarite, 0) / rapports.length},
        "niveau_plagiat": "faible/moyen/élevé"
    },
    "recommandations": [
        "Recommandation 1",
        "Recommandation 2"
    ],
    "suggestions_sanctions": [
        "Suggestion 1",
        "Suggestion 2"
    ]
}

Important : Répondez uniquement avec le JSON, sans texte supplémentaire ni backticks.`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'deepseek/deepseek-chat:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Sunu School AI',
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return cleanedContent;
    } catch (error) {
      console.error('Erreur lors du nettoyage de la réponse:', error);
      throw new Error('Format de réponse invalide');
    }

  } catch(err){
    console.error('Erreur lors de la génération du rapport:', err);
    throw new Error('Erreur lors de la génération du rapport');
  }
}

module.exports = { analyserCopiesForExam, genererRapport };