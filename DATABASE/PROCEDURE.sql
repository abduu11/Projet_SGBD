-- Procedure pour creer un nouvel utilisateur en meme temps les étudiants et ensignants si toutes les conditions, satisfaites.
DELIMITER $$
CREATE PROCEDURE creerUtilisateur( emailParam VARCHAR(100), numeroParam VARCHAR(8), mot_de_passeParam VARCHAR(255), OUT user_id INT)
BEGIN

    DECLARE last_id INT;
    DECLARE nomE VARCHAR(100);
    DECLARE prenomE VARCHAR(50);

    IF (isEtudiantAuthorized(emailParam, numeroParam)) THEN
SELECT Etudiant.INFORMATIONS_ETUDIANT.nom INTO nomE FROM Etudiant.INFORMATIONS_ETUDIANT WHERE INFORMATIONS_ETUDIANT.email_universitaire = emailParam AND INFORMATIONS_ETUDIANT.numero_etudiant = numeroParam;
SELECT Etudiant.INFORMATIONS_ETUDIANT.prenom INTO prenomE FROM Etudiant.INFORMATIONS_ETUDIANT WHERE INFORMATIONS_ETUDIANT.email_universitaire = emailParam AND INFORMATIONS_ETUDIANT.numero_etudiant = numeroParam;

INSERT INTO Utilisateur(nom, prenom, email, mot_de_passe, role) VALUES (nomE, prenomE, emailParam, mot_de_passeParam, 'etudiant');

SET last_id = LAST_INSERT_ID();
INSERT INTO Etudiant(id) VALUES (last_id);
SET user_id = last_id;
END IF;

     IF (isEnseignantAuthorized(emailParam, numeroParam)) THEN
SELECT Enseignant.INFORMATIONS_ENSEIGANT.nom INTO nomE FROM Enseignant.INFORMATIONS_ENSEIGANT WHERE INFORMATIONS_ENSEIGANT.email_universitaire = emailParam AND INFORMATIONS_ENSEIGANT.code_enseignant = numeroParam;
SELECT Enseignant.INFORMATIONS_ENSEIGANT.prenom INTO prenomE FROM Enseignant.INFORMATIONS_ENSEIGANT WHERE INFORMATIONS_ENSEIGANT.email_universitaire = emailParam AND INFORMATIONS_ENSEIGANT.code_enseignant = numeroParam;

INSERT INTO Utilisateur(nom, prenom, email, mot_de_passe, role) VALUES (nomE, prenomE, emailParam, mot_de_passeParam, 'enseignant');

SET last_id = LAST_INSERT_ID();
INSERT INTO Enseignant(id) VALUES (last_id);
SET user_id = last_id;
END IF;

END $$
DELIMITER ;

-- Fonction pour voir si l'utilisateur est un etudiant qui a le droit d'acceder a la plateforme
DELIMITER $$
CREATE FUNCTION isEtudiantAuthorized(email_universitaireParam VARCHAR(100), numero_etudiantParam VARCHAR(8)) RETURNS TINYINT(1) DETERMINISTIC
BEGIN
    DECLARE response TINYINT(1);
    DECLARE count INT;

    set response = 0;
    set count = 0;

SELECT COUNT(id_etudiant) INTO count FROM Etudiant.INFORMATIONS_ETUDIANT WHERE Etudiant.INFORMATIONS_ETUDIANT.email_universitaire = email_universitaireParam AND Etudiant.INFORMATIONS_ETUDIANT.numero_etudiant = numero_etudiantParam;

IF ( count > 0 ) THEN
        SET response = 1;
END IF;

RETURN response;
END $$
DELIMITER ;

-- Fonction pour voir si l'utilisateur est un enseignant qui a le droit d'acceder a la plateforme
DELIMITER $$
CREATE FUNCTION isEnseignantAuthorized(email_universitaireParam VARCHAR(100), code_enseignantParam VARCHAR(8)) RETURNS TINYINT(1) DETERMINISTIC
BEGIN

    DECLARE response TINYINT(1);
    DECLARE count INT;

    set response = 0;
    set count = 0;

SELECT COUNT(id_enseignant) INTO count FROM Enseignant.INFORMATIONS_ENSEIGANT WHERE Enseignant.INFORMATIONS_ENSEIGANT.email_universitaire = email_universitaireParam AND Enseignant.INFORMATIONS_ENSEIGANT.code_enseignant = code_enseignantParam;

IF ( count > 0 ) THEN
        SET response = 1;
END IF;

RETURN response;

END $$
DELIMITER ;
