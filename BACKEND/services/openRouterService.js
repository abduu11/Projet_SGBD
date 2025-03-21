const axios = require('axios');
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

const getChatResponse = async ( message ) => {
    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
    {
            model: "deepseek/deepseek-chat:free",
            messages: [{role: "user", content: message}],
        },
    {
            headers: {
            Authorization: `Bearer ${API_KEY}`,
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "Chatbot SUNU SCHOOL AI",
            "Content-Type": "application/json",
        },
    });
        return response.data.choices[0].message.content;
    } catch (err) {
        console.error("Erreur OpenRouter :", err.response ? err.response.data : err.message);
        throw new Error("Erreur lors de la communication avec OpenRouter.");
    }
};

module.exports = { getChatResponse };