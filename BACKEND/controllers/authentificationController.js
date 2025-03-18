const Utilisateur = require('../models/Utilisateur');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const inscription = (req, res) => {

    const { email, code, mot_de_passe } = req.body;

    if (!email || !code || !mot_de_passe) {
        return res.status(400).json({ message: "Haha je vois vous voulez que mon app crash bien tenter mais je suis Aizen sossuke cela faisait partie de mon plan Yokosso watashi no soul society 🗡️🥋🗡️"});
    }

    Utilisateur.create(email, code, mot_de_passe, (err, result) => {

        if (err) {
            if(err.code === 'ER_DUP_ENTRY'){
                return res.status(409).json({ message: "Cet email est deja associe a un compte" });
            }
            return res.status(500).json({ message: "Erreur survenue lors de la creation de l'utilisateur"});
        }
        if (result){
            return res.status(200).json({ message: " Compte creer avec success", id: result.insertId });
        }
        return res.status(401).json({ message: "Vous n'etes pas autoriser a acceder a ces ressources" });

    });

};

const connexion = async (req, res) => {

    const { email, mot_de_passe, role } = req.body;

    if (!email || !mot_de_passe || !role) {
        return res.status(400).json({ message: "Email, Mot de passe ou role manquant: Haha je vois vous voulez que mon app crash bien tenter mais je suis Aizen sossuke cela faisait partie de mon plan depuis le debut Yokosso watashi no soul society 🗡️🥋🗡️ "});
    }

    Utilisateur.findByEmail(email, (err, result) => {

        if (err) {
            return res.status(500).json({ message:"Erreur survenue lors de la verification", error: err});
        }

        if (!result || result.length === 0) {
            return res.status(401).json({ message: "Erreur survenue lors de la verification", error: err});
        }

        const hashedMDP = result[0].mot_de_passe;
        const roleReceived = result[0].role;
        const id = result[0].user_id;
        const nom = result[0].nom;
        const prenom = result[0].prenom;

        if (!mot_de_passe || !hashedMDP) {
            return res.status(400).json({ message: "Erreur survenue lors de la verification mail ou mot de passe incorrecte", error: err});
        }

        const verifierMDP = bcrypt.compareSync(mot_de_passe, hashedMDP);
        const verifierRole = ( role.includes(roleReceived) );

        if ( !verifierMDP || !verifierRole ) {
            return res.status(401).json({ message: "Email, Mot de passe ou role incorrect "});
        }
        const token = jwt.sign({ id: id, role: role}, process.env.SECRET, { expiresIn: "1h" });
        return res.status(200).json({ message: "Redirection en cours", token, id, nom, prenom, role});

    });
};

const reinitialisationMDP = (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({message: "Email requis: Haha je vois vous voulez que mon app crash bien tenter mais je suis Aizen sossuke cela faisait partie de mon plan Yokosso watashi no soul society 🗡️🥋🗡️"});
    }

    try {
        Utilisateur.findByEmail(email, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({message: "Erreur au niveau du serveur", error: err});
            }
            if (!result || result.length === 0 || result[0].user_id == null) {
                return res.status(500).json({message: "Utilisateur introuvable"});
            }
            return res.status(200).json({message: "OK RAS"});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Erreur interne"});
    }

};

const misajourMDP = async (req, res) => {

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({message: "Email et nouveau mot de passe requis: Haha je vois vous voulez que mon app crash bien tenter mais je suis Aizen sossuke cela faisait partie de mon plan Yokosso watashi no soul society 🗡️🥋🗡️"});  
    }

    try {
        const hashedMDP = bcrypt.hashSync(newPassword, 10);

        Utilisateur.updateMDP(email, hashedMDP, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({message: "Erreur au niveau du serveur", error: err});
            }
            return res.status(200).json({message: "Mot de passe mis a jour avec succes"});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Erreur interne"});
    }

};

module.exports = { inscription, connexion, reinitialisationMDP, misajourMDP };