const Utilisateur = require('../models/Utilisateur');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const inscription = (req, res) => {

    const { email, numero, mot_de_passe } = req.body;

    Utilisateur.findByEmail(email, ( err, result ) => {

       if (err) {
           return res.status(500).json({ message: "Ereur survenue lors de la verification", error : err});
       } if (result.length > 0) {
           return res.status(400).json({ message: "Email deja utilisee" });
       } else {
            Utilisateur.create(email, numero, mot_de_passe, (err, result) => {

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
       }
    });
};

const connexion = async (req, res) => {

    const { email, mot_de_passe, role } = req.body;

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

module.exports = { inscription, connexion };