const axios = require('axios');
require('dotenv').config();

const OPEN_ROUTER_API_KEY = process.env.OPEN_ROUTER_API;

const getChatResponse = async ( message ) => {
    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
    {
            model: "deepseek/deepseek-chat:free",
            messages: [{role: "user", content: message}],
        },
  {
            headers: {
            Authorization: `Bearer ${OPEN_ROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "Chatbot SUNU SCHOOL AI",
            "Content-Type": "application/json",
        },
    });
        return response.data.choices[0].message.content;
    } catch (err) {
        console.error("❌ Erreur OpenRouter :", err.response ? err.response.data : err.message);
        throw new Error("Erreur lors de la communication avec OpenRouter.");
    }
};

module.exports = { getChatResponse };