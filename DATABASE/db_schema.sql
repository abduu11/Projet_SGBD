-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: 
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `GestionExamens`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `GestionExamens` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `GestionExamens`;

-- Vous pouvez modifier son mot de passe si vous le souhaitez
CREATE USER 'sunu_school_admin'@'localhost' IDENTIFIED BY 'passer@2025';

GRANT ALL PRIVILEGES ON GestionExamens.* TO 'sunu_school_admin'@'localhost';

--
-- Table structure for table `Chatbot_Historique`
--

DROP TABLE IF EXISTS `Chatbot_Historique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Chatbot_Historique` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int(11) NOT NULL,
  `question` text NOT NULL,
  `reponse` text NOT NULL,
  `date_interaction` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_utilisateur` (`id_utilisateur`),
  CONSTRAINT `chatbot_historique_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Copie`
--

DROP TABLE IF EXISTS `Copie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Copie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fichier_pdf` varchar(255) NOT NULL,
  `date_soumission` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_etudiant` int(11) NOT NULL,
  `id_examen` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_etudiant` (`id_etudiant`),
  KEY `id_examen` (`id_examen`),
  CONSTRAINT `copie_ibfk_1` FOREIGN KEY (`id_etudiant`) REFERENCES `Etudiant` (`id`) ON DELETE CASCADE,
  CONSTRAINT `copie_ibfk_2` FOREIGN KEY (`id_examen`) REFERENCES `Examen` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Correction`
--

DROP TABLE IF EXISTS `Correction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Correction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_copie` int(11) NOT NULL,
  `note` float DEFAULT NULL CHECK (`note` between 0 and 20),
  `commentaires` text DEFAULT NULL,
  `statut` enum('proposé','validé','modifié') DEFAULT 'proposé',
  `id_enseignant_validateur` int(11) DEFAULT NULL,
  `date_correction` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_copie` (`id_copie`),
  KEY `id_enseignant_validateur` (`id_enseignant_validateur`),
  CONSTRAINT `correction_ibfk_1` FOREIGN KEY (`id_copie`) REFERENCES `Copie` (`id`) ON DELETE CASCADE,
  CONSTRAINT `correction_ibfk_2` FOREIGN KEY (`id_enseignant_validateur`) REFERENCES `Enseignant` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Enseignant`
--

DROP TABLE IF EXISTS `Enseignant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Enseignant` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `enseignant_ibfk_1` FOREIGN KEY (`id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Etudiant`
--

DROP TABLE IF EXISTS `Etudiant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Etudiant` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `etudiant_ibfk_1` FOREIGN KEY (`id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Examen`
--

DROP TABLE IF EXISTS `Examen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Examen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_enseignant` int(11) NOT NULL,
  `fichier_pdf` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_enseignant` (`id_enseignant`),
  CONSTRAINT `examen_ibfk_1` FOREIGN KEY (`id_enseignant`) REFERENCES `Enseignant` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Plagiat`
--

DROP TABLE IF EXISTS `Plagiat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Plagiat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_copie1` int(11) NOT NULL,
  `id_copie2` int(11) NOT NULL,
  `pourcentage_similarite` float DEFAULT NULL CHECK (`pourcentage_similarite` between 0 and 100),
  `date_detection` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_copie1` (`id_copie1`),
  KEY `id_copie2` (`id_copie2`),
  CONSTRAINT `plagiat_ibfk_1` FOREIGN KEY (`id_copie1`) REFERENCES `Copie` (`id`) ON DELETE CASCADE,
  CONSTRAINT `plagiat_ibfk_2` FOREIGN KEY (`id_copie2`) REFERENCES `Copie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Statistiques`
--

DROP TABLE IF EXISTS `Statistiques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Statistiques` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_examen` int(11) NOT NULL,
  `moyenne` float DEFAULT NULL,
  `ecart_type` float DEFAULT NULL,
  `taux_reussite` float DEFAULT NULL CHECK (`taux_reussite` between 0 and 100),
  `date_calcul` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_examen` (`id_examen`),
  CONSTRAINT `statistiques_ibfk_1` FOREIGN KEY (`id_examen`) REFERENCES `Examen` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Utilisateur`
--

DROP TABLE IF EXISTS `Utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('enseignant','etudiant') NOT NULL,
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp(),
  `prenom` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'GestionExamens'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ChercherUtilisateur` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`sunu_school_admin`@`localhost` PROCEDURE `ChercherUtilisateur`(
    IN p_email VARCHAR(100),
    OUT p_id INT,
    OUT p_nom VARCHAR(255),
    OUT p_prenom VARCHAR(255),
    OUT p_email_out VARCHAR(255),
    OUT p_mot_de_passe VARCHAR(255),
    OUT p_role VARCHAR(255)
)
BEGIN
    SELECT id, nom, prenom, email, mot_de_passe, role
    INTO p_id, p_nom, p_prenom, p_email_out, p_mot_de_passe, p_role
    FROM Utilisateur
    WHERE email = p_email
    LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `creeCopie` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`sunu_school_admin`@`localhost` PROCEDURE `creeCopie`(fichier_pdfParam VARCHAR(255), id_etudiantParam INTEGER, id_exmanParam INTEGER)
BEGIN
    INSERT INTO Copie(fichier_pdf, id_etudiant, id_examen)  VALUES (fichier_pdfParam, id_etudiantParam, id_exmanParam);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `creerExamen` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`sunu_school_admin`@`localhost` PROCEDURE `creerExamen`(titreParam VARCHAR(255), descriptionParam TEXT, id_enseignantParam INTEGER, fichier_pdfParam TEXT)
BEGIN
        INSERT INTO Examen(titre, description, id_enseignant, fichier_pdf) VALUES (titreParam, descriptionParam, id_enseignantParam, fichier_pdfParam);
    end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreerUtilisateur` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`sunu_school_admin`@`localhost` PROCEDURE `CreerUtilisateur`(
    IN nomParam VARCHAR(255),
    IN prenomParam VARCHAR(255),
    IN emailParam VARCHAR(255),
    IN mot_de_passeParam VARCHAR(255),
    IN roleParam VARCHAR(255)
)
BEGIN
    DECLARE user_id INTEGER;

    INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, role)
    VALUES (nomParam, prenomParam, emailParam, mot_de_passeParam, roleParam);

    SET user_id = LAST_INSERT_ID();

    IF roleParam = 'enseignant' THEN
        INSERT INTO Enseignant(id) VALUES (user_id);
    ELSEIF roleParam = 'etudiant' THEN
        INSERT INTO Etudiant(id) VALUES (user_id);
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteCopie` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
PROCEDURE `deleteCopie`(id_etudiantParam INTEGER, id_examenParam INTEGER)
BEGIN
    DELETE FROM Copie WHERE id_etudiant = id_etudiantParam AND id_examen = id_examenParam;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Current Database: `test`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `test` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `test`;

--
-- Dumping routines for database 'test'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `AddGeometryColumn` */;
ALTER DATABASE `test` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
DELIMITER ;;
CREATE DEFINER=`` PROCEDURE `AddGeometryColumn`(catalog varchar(64), t_schema varchar(64),
   t_name varchar(64), geometry_column varchar(64), t_srid int)
begin
  set @qwe= concat('ALTER TABLE ', t_schema, '.', t_name, ' ADD ', geometry_column,' GEOMETRY REF_SYSTEM_ID=', t_srid); PREPARE ls from @qwe; execute ls; deallocate prepare ls; end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `test` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DropGeometryColumn` */;
ALTER DATABASE `test` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
DELIMITER ;;
CREATE DEFINER=`` PROCEDURE `DropGeometryColumn`(catalog varchar(64), t_schema varchar(64),
   t_name varchar(64), geometry_column varchar(64))
begin
  set @qwe= concat('ALTER TABLE ', t_schema, '.', t_name, ' DROP ', geometry_column); PREPARE ls from @qwe; execute ls; deallocate prepare ls; end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `test` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-08 18:17:36
