const Utilisateur = require('../models/Utilisateur');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

const inscription = (req, res) => {

    const { email, numero, mot_de_passe } = req.body;

    Utilisateur.findByEmail(email, (err, result   ) => {
       if (err) {
           return res.status(500).json({ message: "Ereur survenue lors de la verification", error : err});
       } if (result.length > 0) {
           return res.status(400).json({ message: "Email deja utilisee" });
       } else {

            Utilisateur.create(email, numero, mot_de_passe, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Erreur survenue lors de la creation de l'utilisateur", error: err });
                }
                if (result){
                    return res.status(200).json({ message: " Compte creer avec success", id: result.insertId });
                } else {
                    return res.status(401).json({ message: "Vous n'etes pas autoriser a acceder a ces ressources" });
                }
            });
        }
    });
};

const connexion = async (req, res) => {

    const { email, numero_etudiant, mot_de_passe, role } = req.body;

    let hashedMDP = "";
    let roleReceived = "";
    let id;
    let nom = "";
    let prenom = "";
    let emailReceived = "";


    Utilisateur.findByEmail(email, (err, result) => {
        if (err) {
            return res.status(500).json({ message:"Erreur survenue lors de la verification", error: err});
        }
        hashedMDP = result[0].mot_de_passe;
        roleReceived = result[0].role;
        id = result[0].id;
        nom = result[0].nom;
        prenom = result[0].prenom;
        emailReceived = result[0].email;
    });

    const verifierMDP = bcrypt.compareSync(mot_de_passe, hashedMDP);
    const verifierRole = ( role.includes(roleReceived) );
    const verifierEmail = ( email.includes(emailReceived) );

    if ( !verifierMDP || !verifierRole || !verifierEmail ) {
        return res.status(401).json({ message: "Email, Mot de passe ou role incorrect "});
    }

    const token = jwt.sign({ id: id, role: role}, process.env.SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: "Redirection en cours", token, id, nom, prenom, role})
};

module.exports = { inscription, connexion };