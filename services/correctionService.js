const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const API_KEY = process.env.OPEN_ROUTER_API;

const analyserCopie = async (copiePDF, corrigeType) => {
    try {
        const dataBuffer = fs.readFileSync(copiePDF);
        const pdfData = await pdfParse(dataBuffer);
        const copieContent = pdfData.text.trim();

        const prompt = `Tu es un professeur qui corrige une copie d'examen. 
        Voici le corrigé type : ${corrigeType}
        
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

        return JSON.parse(response.data.choices[0].message.content);
    } catch (err) {
        console.error("Erreur lors de l'analyse de la copie:", err);
        throw new Error("Erreur lors de l'analyse de la copie");
    }
};

module.exports = { analyserCopie }; 