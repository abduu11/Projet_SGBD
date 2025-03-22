const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');
require('dotenv').config();

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

const extractTextFromPDF = (pdfPath) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            try {
                const text = pdfData.Pages
                    .map(page => page.Texts
                        .map(text => decodeURIComponent(text.R[0].T))
                        .join(' ')
                    )
                    .join('\n');
                resolve(text);
            } catch (error) {
                reject(new Error(`Erreur lors de l'extraction du texte: ${error.message}`));
            }
        });

        pdfParser.on("pdfParser_dataError", (errData) => {
            reject(new Error(`Erreur lors du parsing du PDF: ${errData.parserError}`));
        });

        pdfParser.loadPDF(pdfPath);
    });
};

const analyserCopie = async (id_examen, copiePDF) => {
    let corrigeTypePath, copieFullPath;

    try {

        corrigeTypePath = path.join(__dirname, '..', 'uploads', 'corriges', `corrige_${id_examen}.pdf`);
        copieFullPath = path.join(__dirname, '..', 'uploads', copiePDF);

        if (!fs.existsSync(corrigeTypePath)) {
            throw new Error("Le corrigé type n'existe pas pour cet examen");
        }
        if (!fs.existsSync(copieFullPath)) {
            throw new Error("La copie de l'étudiant n'existe pas");
        }

        console.log("Lecture du corrigé type...");
        const corrigeContent = await extractTextFromPDF(corrigeTypePath);

        console.log("Lecture de la copie...");
        const copieContent = await extractTextFromPDF(copieFullPath);

        if (!corrigeContent || !copieContent) {
            throw new Error("Impossible d'extraire le contenu des fichiers PDF");
        }

        console.log("Analyse avec l'IA...");
        const prompt = `Tu es un professeur qui corrige une copie d'examen. Ne soit pas trop strict aussi soit un cool prof mais attention pas trop gentil aussi.
        Voici le corrigé type : ${corrigeContent}
        
        Et voici la copie de l'étudiant : ${copieContent}
        
        Compare la copie avec le corrigé type et donne :
        1. Une note sur 20
        2. Un commentaire détaillé justifiant la note
        3. Les points forts et points faibles
        
        Format de réponse souhaité :
        {
            "note": [note sur 20],
            "commentaire": [commentaire détaillé],
            "points_forts": [liste des points forts],
            "points_faibles": [liste des points faibles]
        }`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-chat:free",
                messages: [{ role: "system", content: prompt }],
                max_tokens: 1000,
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "HTTP-Referer": "http://localhost:5000",
                    "X-Title": "Chatbot SUNU SCHOOL AI",
                    "Content-Type": "application/json",
                }
            }
        );

        let content = response.data.choices[0].message.content.trim();

        if (content.startsWith("```json")) {
            content = content.slice(7); 
            if (content.endsWith("```")) {
                content = content.slice(0, -3);
            }
            content = content.trim();
        }

        const result = JSON.parse(content);

        return {
            note: parseFloat(result.note) || 0,
            commentaire: JSON.stringify({
                general: result.commentaire,
                points_forts: result.points_forts,
                points_faibles: result.points_faibles
            })
        };

    } catch (error) {
        console.error("Erreur détaillée:", {
            message: error.message,
            corrigePath: corrigeTypePath,
            copiePath: copieFullPath,
            stack: error.stack
        });
        throw new Error(`Erreur lors de l'analyse: ${error.message}`);
    }
};

module.exports = { analyserCopie };


