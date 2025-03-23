const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');
const pdfParse = require('pdf-parse');
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
const OPEN_ROUTER_API_KEY26 = process.env.OPEN_ROUTER_API26;
const OPEN_ROUTER_API_KEY27 = process.env.OPEN_ROUTER_API27;
const OPEN_ROUTER_API_KEY28 = process.env.OPEN_ROUTER_API28;
const OPEN_ROUTER_API_KEY29 = process.env.OPEN_ROUTER_API29;
const OPEN_ROUTER_API_KEY30 = process.env.OPEN_ROUTER_API30;
const OPEN_ROUTER_API_KEY31 = process.env.OPEN_ROUTER_API31;
const OPEN_ROUTER_API_KEY32 = process.env.OPEN_ROUTER_API32;
const OPEN_ROUTER_API_KEY33 = process.env.OPEN_ROUTER_API33;
const OPEN_ROUTER_API_KEY34 = process.env.OPEN_ROUTER_API34;
const OPEN_ROUTER_API_KEY35 = process.env.OPEN_ROUTER_API35;
const OPEN_ROUTER_API_KEY36 = process.env.OPEN_ROUTER_API36;
const OPEN_ROUTER_API_KEY37 = process.env.OPEN_ROUTER_API37;
const OPEN_ROUTER_API_KEY38 = process.env.OPEN_ROUTER_API38;
const OPEN_ROUTER_API_KEY39 = process.env.OPEN_ROUTER_API39;
const OPEN_ROUTER_API_KEY40 = process.env.OPEN_ROUTER_API40;
const OPEN_ROUTER_API_KEY41 = process.env.OPEN_ROUTER_API41;
const OPEN_ROUTER_API_KEY42 = process.env.OPEN_ROUTER_API42;
const OPEN_ROUTER_API_KEY43 = process.env.OPEN_ROUTER_API43;
const OPEN_ROUTER_API_KEY44 = process.env.OPEN_ROUTER_API44;
const OPEN_ROUTER_API_KEY45 = process.env.OPEN_ROUTER_API45;
const OPEN_ROUTER_API_KEY46 = process.env.OPEN_ROUTER_API46;
const OPEN_ROUTER_API_KEY47 = process.env.OPEN_ROUTER_API47;
const OPEN_ROUTER_API_KEY48 = process.env.OPEN_ROUTER_API48;
const OPEN_ROUTER_API_KEY49 = process.env.OPEN_ROUTER_API49;
const OPEN_ROUTER_API_KEY50 = process.env.OPEN_ROUTER_API50;
const OPEN_ROUTER_API_KEY51 = process.env.OPEN_ROUTER_API51;
const OPEN_ROUTER_API_KEY52 = process.env.OPEN_ROUTER_API52;
const OPEN_ROUTER_API_KEY53 = process.env.OPEN_ROUTER_API53;
const OPEN_ROUTER_API_KEY54 = process.env.OPEN_ROUTER_API54;
const OPEN_ROUTER_API_KEY55 = process.env.OPEN_ROUTER_API55;
const OPEN_ROUTER_API_KEY56 = process.env.OPEN_ROUTER_API56;
const OPEN_ROUTER_API_KEY57 = process.env.OPEN_ROUTER_API57;
const OPEN_ROUTER_API_KEY58 = process.env.OPEN_ROUTER_API58;
const OPEN_ROUTER_API_KEY59 = process.env.OPEN_ROUTER_API59;
const OPEN_ROUTER_API_KEY60 = process.env.OPEN_ROUTER_API60;
const OPEN_ROUTER_API_KEY61 = process.env.OPEN_ROUTER_API61;
const OPEN_ROUTER_API_KEY62 = process.env.OPEN_ROUTER_API62;
const OPEN_ROUTER_API_KEY63 = process.env.OPEN_ROUTER_API63;
const OPEN_ROUTER_API_KEY64 = process.env.OPEN_ROUTER_API64;
const OPEN_ROUTER_API_KEY65 = process.env.OPEN_ROUTER_API65;
const OPEN_ROUTER_API_KEY66 = process.env.OPEN_ROUTER_API66;
const OPEN_ROUTER_API_KEY67 = process.env.OPEN_ROUTER_API67;
const OPEN_ROUTER_API_KEY68 = process.env.OPEN_ROUTER_API68;
const OPEN_ROUTER_API_KEY69 = process.env.OPEN_ROUTER_API69;
const OPEN_ROUTER_API_KEY70 = process.env.OPEN_ROUTER_API70;
const OPEN_ROUTER_API_KEY71 = process.env.OPEN_ROUTER_API71;
const OPEN_ROUTER_API_KEY72 = process.env.OPEN_ROUTER_API72;
const OPEN_ROUTER_API_KEY73 = process.env.OPEN_ROUTER_API73;
const OPEN_ROUTER_API_KEY74 = process.env.OPEN_ROUTER_API74;
const OPEN_ROUTER_API_KEY75 = process.env.OPEN_ROUTER_API75;
const OPEN_ROUTER_API_KEY76 = process.env.OPEN_ROUTER_API76;
const OPEN_ROUTER_API_KEY77 = process.env.OPEN_ROUTER_API77;
const OPEN_ROUTER_API_KEY78 = process.env.OPEN_ROUTER_API78;
const OPEN_ROUTER_API_KEY79 = process.env.OPEN_ROUTER_API79;
const OPEN_ROUTER_API_KEY80 = process.env.OPEN_ROUTER_API80;
const OPEN_ROUTER_API_KEY81 = process.env.OPEN_ROUTER_API81;
const OPEN_ROUTER_API_KEY82 = process.env.OPEN_ROUTER_API82;
const OPEN_ROUTER_API_KEY83 = process.env.OPEN_ROUTER_API83;
const OPEN_ROUTER_API_KEY84 = process.env.OPEN_ROUTER_API84;
const OPEN_ROUTER_API_KEY85 = process.env.OPEN_ROUTER_API85;
const OPEN_ROUTER_API_KEY86 = process.env.OPEN_ROUTER_API86;
const OPEN_ROUTER_API_KEY87 = process.env.OPEN_ROUTER_API87;
const OPEN_ROUTER_API_KEY88 = process.env.OPEN_ROUTER_API88;
const OPEN_ROUTER_API_KEY89 = process.env.OPEN_ROUTER_API89;
const OPEN_ROUTER_API_KEY90 = process.env.OPEN_ROUTER_API90;
const OPEN_ROUTER_API_KEY91 = process.env.OPEN_ROUTER_API91;
const OPEN_ROUTER_API_KEY92 = process.env.OPEN_ROUTER_API92;
const OPEN_ROUTER_API_KEY93 = process.env.OPEN_ROUTER_API93;
const OPEN_ROUTER_API_KEY94 = process.env.OPEN_ROUTER_API94;
const OPEN_ROUTER_API_KEY95 = process.env.OPEN_ROUTER_API95;
const OPEN_ROUTER_API_KEY96 = process.env.OPEN_ROUTER_API96;
const OPEN_ROUTER_API_KEY97 = process.env.OPEN_ROUTER_API97;
const OPEN_ROUTER_API_KEY98 = process.env.OPEN_ROUTER_API98;
const OPEN_ROUTER_API_KEY99 = process.env.OPEN_ROUTER_API99;
const OPEN_ROUTER_API_KEY100 = process.env.OPEN_ROUTER_API100;

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
    OPEN_ROUTER_API_KEY26,
    OPEN_ROUTER_API_KEY27,
    OPEN_ROUTER_API_KEY28,
    OPEN_ROUTER_API_KEY29,
    OPEN_ROUTER_API_KEY30,
    OPEN_ROUTER_API_KEY31,
    OPEN_ROUTER_API_KEY32,
    OPEN_ROUTER_API_KEY33,
    OPEN_ROUTER_API_KEY34,
    OPEN_ROUTER_API_KEY35,
    OPEN_ROUTER_API_KEY36,
    OPEN_ROUTER_API_KEY37,
    OPEN_ROUTER_API_KEY38,
    OPEN_ROUTER_API_KEY39,
    OPEN_ROUTER_API_KEY40,
    OPEN_ROUTER_API_KEY41,
    OPEN_ROUTER_API_KEY42,
    OPEN_ROUTER_API_KEY43,
    OPEN_ROUTER_API_KEY44,
    OPEN_ROUTER_API_KEY45,
    OPEN_ROUTER_API_KEY46,
    OPEN_ROUTER_API_KEY47,
    OPEN_ROUTER_API_KEY48,
    OPEN_ROUTER_API_KEY49,
    OPEN_ROUTER_API_KEY50,
    OPEN_ROUTER_API_KEY51,
    OPEN_ROUTER_API_KEY52,
    OPEN_ROUTER_API_KEY53,
    OPEN_ROUTER_API_KEY54,
    OPEN_ROUTER_API_KEY55,
    OPEN_ROUTER_API_KEY56,
    OPEN_ROUTER_API_KEY57,
    OPEN_ROUTER_API_KEY58,
    OPEN_ROUTER_API_KEY59,
    OPEN_ROUTER_API_KEY60,
    OPEN_ROUTER_API_KEY61,
    OPEN_ROUTER_API_KEY62,
    OPEN_ROUTER_API_KEY63,
    OPEN_ROUTER_API_KEY64,
    OPEN_ROUTER_API_KEY65,
    OPEN_ROUTER_API_KEY66,
    OPEN_ROUTER_API_KEY67,
    OPEN_ROUTER_API_KEY68,
    OPEN_ROUTER_API_KEY69,
    OPEN_ROUTER_API_KEY70,
    OPEN_ROUTER_API_KEY71,
    OPEN_ROUTER_API_KEY72,
    OPEN_ROUTER_API_KEY73,
    OPEN_ROUTER_API_KEY74,
    OPEN_ROUTER_API_KEY75,
    OPEN_ROUTER_API_KEY76,
    OPEN_ROUTER_API_KEY77,
    OPEN_ROUTER_API_KEY78,
    OPEN_ROUTER_API_KEY79,
    OPEN_ROUTER_API_KEY80,
    OPEN_ROUTER_API_KEY81,
    OPEN_ROUTER_API_KEY82,
    OPEN_ROUTER_API_KEY83,
    OPEN_ROUTER_API_KEY84,
    OPEN_ROUTER_API_KEY85,
    OPEN_ROUTER_API_KEY86,
    OPEN_ROUTER_API_KEY87,
    OPEN_ROUTER_API_KEY88,
    OPEN_ROUTER_API_KEY89,
    OPEN_ROUTER_API_KEY90,
    OPEN_ROUTER_API_KEY91,
    OPEN_ROUTER_API_KEY92,
    OPEN_ROUTER_API_KEY93,
    OPEN_ROUTER_API_KEY94,
    OPEN_ROUTER_API_KEY95,
    OPEN_ROUTER_API_KEY96,
    OPEN_ROUTER_API_KEY97,
    OPEN_ROUTER_API_KEY98,
    OPEN_ROUTER_API_KEY99,
    OPEN_ROUTER_API_KEY100,
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
                    .map(page =>
                        page.Texts
                            .map(textObj => decodeURIComponent(textObj.R[0].T))
                            .join(' ')
                    )
                    .join('\n');
                resolve(text);
            } catch (err) {
                reject(err);
            }
        });

        pdfParser.on("pdfParser_dataError", (err) => {
            reject(err.parserError);
        });

        pdfParser.loadPDF(pdfPath);
    });
};

const analyserCopie = async (id_examen, copiePDF) => {
    try {
        // Vérification des paramètres
        if (!id_examen || !copiePDF) {
            throw new Error("Paramètres manquants pour l'analyse de la copie");
        }

        // Vérification de l'existence des fichiers
        const copieFullPath = path.join(__dirname, '../uploads', copiePDF);
        const corrigeTypePath = path.join(__dirname, '../uploads/corriges', `corrige_${id_examen}.pdf`);

        if (!fs.existsSync(copieFullPath)) {
            throw new Error("Le fichier de la copie n'existe pas");
        }

        if (!fs.existsSync(corrigeTypePath)) {
            throw new Error("Le corrigé type n'existe pas");
        }

        // Lecture et analyse des fichiers
        const dataBuffer = fs.readFileSync(copieFullPath);
        const pdfData = await pdfParse(dataBuffer);
        const copieContent = pdfData.text.trim();

        if (!copieContent) {
            throw new Error("Le contenu de la copie est vide");
        }

        const prompt = `Tu es un professeur qui corrige une copie d'examen. 
        Voici le corrigé type : ${corrigeTypePath}
        
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

        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            throw new Error("Réponse invalide de l'API OpenRouter");
        }

        let content = response.data.choices[0].message.content.trim();

        if (content.startsWith("```json")) {
            content = content.slice(7);
            if (content.endsWith("```")) {
                content = content.slice(0, -3);
            }
            content = content.trim();
        }

        const result = JSON.parse(content);

        if (!result.note || !result.commentaire) {
            throw new Error("Format de réponse invalide de l'API");
        }

        return {
            note: parseFloat(result.note) || 0,
            commentaire: JSON.stringify({
                general: result.commentaire,
                points_forts: result.points_forts || [],
                points_faibles: result.points_faibles || []
            })
        };

    } catch (error) {
        console.error("Erreur détaillée:", {
            message: error.message,
            stack: error.stack
        });
        throw new Error(`Erreur lors de l'analyse: ${error.message}`);
    }
};

module.exports = { analyserCopie };


