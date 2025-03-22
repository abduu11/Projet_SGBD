const { analyserCopiesForExam, genererRapport } = require('../services/plagiatService');
const Plagiat = require('../models/Plagiat');
const db = require('../configs/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const detecterPlagiatParExamen = async (req, res) => {
  const examId = req.params.id;
  
  try {
    console.log("Début de l'analyse pour l'examen:", examId);
    
    const rapports = await new Promise((resolve, reject) => {
      analyserCopiesForExam(examId, (err, resultats) => {
        if (err) {
          console.error('Erreur analyse copies:', err);
          reject(err);
        } else {
          resolve(resultats);
        }
      });
    });

    if (!rapports || rapports.length === 0) {
      console.log("Aucun rapport généré");
      return res.status(200).json({ rapports: [] });
    }

    console.log("Nombre de rapports générés:", rapports.length);

    const enrichirRapport = async (rapport) => {
      try {
        const [etudiant1, etudiant2] = await Promise.all([
          new Promise((resolve, reject) => {
            db.query(
              `SELECT u.nom, u.prenom 
               FROM Copie c 
               JOIN Utilisateur u ON c.id_etudiant = u.id 
               WHERE c.id = ?`,
              [rapport.id_copie1],
              (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
              }
            );
          }),
          new Promise((resolve, reject) => {
            db.query(
              `SELECT u.nom, u.prenom 
               FROM Copie c 
               JOIN Utilisateur u ON c.id_etudiant = u.id 
               WHERE c.id = ?`,
              [rapport.id_copie2],
              (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
              }
            );
          })
        ]);

        const rapportEnrichi = {
          ...rapport,
          etudiant1_nom: etudiant1?.nom || 'Inconnu',
          etudiant1_prenom: etudiant1?.prenom || '',
          etudiant2_nom: etudiant2?.nom || 'Inconnu',
          etudiant2_prenom: etudiant2?.prenom || ''
        };

        await new Promise((resolve, reject) => {
          Plagiat.createPlagiat({
            id_copie1: rapport.id_copie1,
            id_copie2: rapport.id_copie2,
            pourcentage_similarite: rapport.pourcentage_similarite
          }, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return rapportEnrichi;
      } catch (error) {
        console.error('Erreur lors de l\'enrichissement du rapport:', error);
        return rapport;
      }
    };

    const rapportsEnrichis = await Promise.all(
      rapports.map(rapport => enrichirRapport(rapport))
    );

    console.log("Traitement terminé, envoi de la réponse");
    res.status(200).json({ rapports: rapportsEnrichis });

  } catch (error) {
    console.error('Erreur détection plagiat par examen:', error);
    res.status(500).json({ 
      erreur: 'Erreur lors de la détection de plagiat.',
      details: error.message 
    });
  }
};

const genererRapportPDF = async (req, res) => {
  const examId = req.params.id;

  try {
    const rapports = await new Promise((resolve, reject) => {
      analyserCopiesForExam(examId, (err, resultats) => {
        if (err) reject(err);
        else resolve(resultats);
      });
    });

    if (!rapports || rapports.length === 0) {
      return res.status(400).json({
        erreur: 'Aucun rapport de plagiat disponible pour cet examen'
      });
    }

    const rapportIA = await genererRapport(rapports);
    let rapportData;
    
    try {
      rapportData = JSON.parse(rapportIA);
    } catch (error) {
      console.error('Erreur lors du parsing du rapport:', error);
      return res.status(500).json({
        erreur: 'Format de rapport invalide',
        details: error.message
      });
    }

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const rapportsDir = path.join(uploadsDir, 'rapports');

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      if (!fs.existsSync(rapportsDir)) {
        fs.mkdirSync(rapportsDir, { recursive: true });
      }
    } catch (error) {
      console.error('Erreur lors de la création des dossiers:', error);
      return res.status(500).json({
        erreur: 'Erreur lors de la création des dossiers',
        details: error.message
      });
    }

    const doc = new PDFDocument();
    const fileName = `rapport_plagiat_${examId}_${Date.now()}.pdf`;
    const filePath = path.join(rapportsDir, fileName);

    const writeStream = fs.createWriteStream(filePath);
    
    writeStream.on('error', (error) => {
      console.error('Erreur lors de l\'écriture du fichier:', error);
      res.status(500).json({
        erreur: 'Erreur lors de la création du fichier PDF',
        details: error.message
      });
    });

    writeStream.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Erreur lors de l\'envoi du fichier:', err);
        }
        fs.unlink(filePath, (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier:', err);
        });
      });
    });

    doc.pipe(writeStream);

    doc.fontSize(20).text('Rapport de Plagiat', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('Résumé', { underline: true });
    doc.fontSize(12).text(rapportData.resume);
    doc.moveDown();

    doc.fontSize(16).text('Analyse Détaillée', { underline: true });
    doc.fontSize(12).text(rapportData.analyse);
    doc.moveDown();

    doc.fontSize(16).text('Statistiques', { underline: true });
    doc.fontSize(12).text(`Nombre de cas détectés: ${rapportData.statistiques.nombre_cas}`);
    doc.text(`Moyenne de similarité: ${rapportData.statistiques.moyenne_similarite.toFixed(2)}%`);
    doc.text(`Niveau de plagiat: ${rapportData.statistiques.niveau_plagiat}`);
    doc.moveDown();

    doc.fontSize(16).text('Recommandations', { underline: true });
    rapportData.recommandations.forEach(rec => {
      doc.fontSize(12).text(`• ${rec}`);
    });
    doc.moveDown();

    doc.fontSize(16).text('Suggestions de Sanctions', { underline: true });
    rapportData.suggestions_sanctions.forEach(sanction => {
      doc.fontSize(12).text(`• ${sanction}`);
    });

    doc.end();

  } catch(err){
    console.error('Erreur lors de la génération du rapport:', err);
    res.status(500).json({
      erreur: 'Erreur lors de la génération du rapport',
      details: err.message
    });
  }
};

module.exports = { detecterPlagiatParExamen, genererRapportPDF };