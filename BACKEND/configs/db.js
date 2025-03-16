const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) {
        console.log("Erreur survenue lers de la connexion a la base de donnees", err);
    } else {
        console.log("Connexion a la base de donnees reussie");
    }
});

module.exports = db;