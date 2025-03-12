const db = require("../configs/db");
const bcrypt = require("bcryptjs");

const Utilisateur = {

    create: ( email, numero, mot_de_passe, callback ) => {
      const hashedPassword = bcrypt.hashSync(mot_de_passe, 10);
      const query = "CALL CreerUtilisateur(?, ?, ?, @user_id)";

      db.query(query, [ email, numero, hashedPassword ], (err, result) => {
          if (err) {
              return callback(err,  { message : "Vous ne figurer pas dans notre base de donnees" });
          }
          db.query("SELECT @user_id AS id", (err, result) => {
              if (err) {
                  return callback(err, null);
              }
              const insertId = result[0].id;
              return callback(null, insertId);
          });
      });
    },

    findByEmail: ( email, callback ) => {

        const query = "CALL authentificationVerif(?, @id, @prenom, @nom, @role, @mot_de_passe)";

        db.query(query, [email], (err, result) => {
            if (err) {
                return callback(err);
            }
            db.query("SELECT @id AS user_id, @prenom AS prenom, @nom AS nom, @role AS role, @mot_de_passe AS mot_de_passe", (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, result);
            });
        });

    },

    updateMDP: ( email, hashedMDP, callback ) => {
      const query = "UPDATE Utilisateur SET mot_de_passe = ? WHERE email = ?";

      db.query(query, [hashedMDP, email], (err, result) => {
          if (err) {
              console.log(err)
              return callback(err);
          }
          console.log(result);
          return callback(null, result);
      })
    },
}
module.exports = Utilisateur;