const db = require("../configs/db");
const exam = require("../models/Examen");
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { getCorrigeTypeDeepSeek } = require("../services/corrigeTypeService");
const Correction = require("../models/Correction");
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const getAllExamens = (req, res) => {
    const id_enseignant = req.params.id;
    exam.getAllExams(id_enseignant, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération des examens", error: err });
        }
        return res.status(200).json(result);
    });
};

const getEnseignants = (req, res) => {
    const query = `SELECT * FROM Utilisateur WHERE role = 'enseignant'`;
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de la récupération des enseignants", error: err });
        }
        return res.status(200).json(result);
    });
};

const getExamsForStudent = (req, res) => {
    const id_etudiant = req.params.id;
    const id_enseignant = req.query.id_enseignant;

    const query = `
        SELECT Examen.*
        FROM Examen
        WHERE Examen.id_enseignant = ?
        ORDER BY Examen.date_creation DESC
    `;
    db.query(query, [id_enseignant], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des examens', error: err });
        }
        return res.status(200).json(result);
    });
};

const createExamen = async (req, res) => {
    try {

        const { titre, description, id_enseignant } = req.body;
        const fichier_pdf = req.file?.filename || null;

        if (!titre || !description || !id_enseignant || !fichier_pdf) {
            return res.status(400).json({ message: "Tous les champs sont requis !" });
        }

        if (isNaN(Number(id_enseignant))) {
            return res.status(400).json({ message: "ID enseignant invalide" });
        }

        exam.createExam(titre, description, id_enseignant, fichier_pdf, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Une erreur s'est produite lors de la création de l'examen." });
            }
            return res.status(201).json({ message: "Examen créé avec succès", examId: result });
        });

    } catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

const deleteExamen = (req, res) => {
    const id_examen = req.params.id;

    const getFilePathQuery = 'SELECT fichier_pdf FROM Examen WHERE id = ?';
    db.query(getFilePathQuery, [id_examen], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération du fichier', error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Examen non trouvé' });
        }

        const fichier_pdf = result[0].fichier_pdf;
        const filePath = path.isAbsolute(fichier_pdf) ? fichier_pdf : path.join(__dirname, "..", "uploads", fichier_pdf);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ message: 'Fichier non trouvé' });
            }

            const deleteQuery = 'DELETE FROM Examen WHERE id = ?';
            db.query(deleteQuery, [id_examen], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'examen', error: err });
                }

                fs.unlink(filePath, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Erreur lors de la suppression du fichier', error: err });
                    }
                    res.status(200).json({ message: 'Examen et fichier supprimés avec succès' });
                });
            });
        });
    });
};

const cleanTextForWinAnsi = (text) => {
    return text.replace(/[^\x00-\xFF]/g, '');
};


const generateCorrectionType = async (req, res) => {
    const { id_examen } = req.body;

    if (!id_examen) {
        return res.status(400).json({ message: "ID examen requis" });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            exam.getPDFFile(id_examen, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Fichier PDF non trouvé en base de données" });
        }

        const pdfPath = path.join(__dirname, "../uploads", result[0].fichier_pdf);

        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ message: "Le fichier PDF n'existe pas sur le serveur" });
        }

        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);
        const examenContent = pdfData.text.trim();

        if (!examenContent) {
            return res.status(400).json({ message: "Impossible d'extraire le contenu du fichier PDF" });
        }

        const prompt = `Voici un sujet d'examen extrait d'un fichier PDF. Génère un corrigé type structuré pour cet examen.\n\nSujet d'examen:\n${cleanTextForWinAnsi(examenContent)}\n\nCorrigé type (STP j'insiste ecrit comme si tu avais une feuille A4 je dois pouvoir l'imprimer en PDF):`;
        const corrigeType = await getCorrigeTypeDeepSeek(prompt);

        const corrigesDir = path.join(__dirname, "../uploads/corriges");
        if (!fs.existsSync(corrigesDir)) {
            fs.mkdirSync(corrigesDir, { recursive: true });
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]);
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        const lineHeight = 20;
        const margin = 50;

        let y = height - margin;
        const maxWidth = width - 2 * margin;

        const lines = corrigeType.split("\n");

        for (const line of lines) {
            const words = line.split(" ");
            let currentLine = "";

            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const testWidth = font.widthOfTextAtSize(testLine, fontSize);

                if (testWidth > maxWidth) {
                    page.drawText(currentLine, {
                        x: margin,
                        y,
                        size: fontSize,
                        font,
                        color: rgb(0, 0, 0),
                    });

                    y -= lineHeight;
                    currentLine = word;

                    if (y < margin) {
                        const newPage = pdfDoc.addPage([595, 842]);
                        y = height - margin;
                        page = newPage;
                    }
                } else {
                    currentLine = testLine;
                }
            }

            if (currentLine) {
                page.drawText(currentLine, {
                    x: margin,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight;

                if (y < margin) {
                    const newPage = pdfDoc.addPage([595, 842]);
                    y = height - margin;
                    page = newPage;
                }
            }
        }

        const pdfBytes = await pdfDoc.save();
        const correctionFileName = `corrige_${id_examen}.pdf`;
        const correctionFilePath = path.join(corrigesDir, correctionFileName);
        fs.writeFileSync(correctionFilePath, pdfBytes);

        Correction.createCorrection({ id_examen, corrige_type: correctionFilePath }, (err, result) => {
            if (err) {
                console.error("Erreur lors de la création de la correction :", err);
                return res.status(500).json({ message: "Erreur lors de la création de la correction", error: err });
            }
            return res.status(201).json({ message: "Correction créée avec succès", correctionId: result });
        });

    } catch (error) {
        console.error("Erreur lors de la génération du corrigé :", error);
        return res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};



module.exports = { createExamen, deleteExamen , getAllExamens, getExamsForStudent, getEnseignants, generateCorrectionType };