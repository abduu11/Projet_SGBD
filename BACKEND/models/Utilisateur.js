const db = require("../configs/db");
const bcrypt = require("bcryptjs");

const Utilisateur = {

    create: ( email, numero, mot_de_passe, callback ) => {
      const hashedPassword = bcrypt.hashSync(mot_de_passe, 10);
      const query = "CALL CreerUtilisateur(?, ?, ?, @user_id)";

      db.query(query, [ email, numero, hashedPassword ], (err, result) => {
          if (err) {
              console.log(err);
              return callback(err,  { message : "Vous ne figurer pas dans notre base de donnees" });
          }
          db.query("SELECT @user_id AS id", (err, result) => {
              if (err) {
                  console.log(err)
                  return callback(err, null);
              }
              const insertId = result[0].id;
              return callback(null, insertId);
          });
      });
    },

    findByEmail: ( email, callback ) => {
        const query = "SELECT * FROM Utilisateur WHERE email = ?";
        db.query(query, [email], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, { message: "Utilisateur introuvable "});
            } else if (result.length > 0) {
                return callback(null, {message: "L'email est deja associer a un compte"});
            } else {
                return callback(null, result);
            }
        });
    },
}

module.exports = Utilisateur;