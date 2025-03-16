import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import { Alert, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import { CircleUserRound, HelpCircle, Lock } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Connexion.module.css';

function Connexion() {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMot_de_passe] = useState('');
  const [role, setRole] = useState('etudiant');
  const [message, setMessage] = useState(''); 
  const [color, setColor] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !mot_de_passe) {
      setMessage('Assurez vous que toutes les champs soient remplis');
      setColor('secondary');
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/authentification/connexion', {email, mot_de_passe, role});
        if (response.status === 200) {
          //gestion des donnees recu du serveur
          localStorage.setItem('id_utilisateur', response.data.id);
          localStorage.setItem('nom', response.data.nom);
          localStorage.setItem('prenom', response.data.prenom);
          localStorage.setItem('token', response.data.token);

          login(response.data.token);

          navigate("/dashboard");
        } else {
         setMessage(response.data.message);
         setColor("error");
        }
      } catch (err) {
        setMessage("Email, mot de passe ou role incorrecte");
        setColor("error");
      }
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftPanel}>
        <div className={styles.overlay}></div>
        <div className={styles.welcomeContent}>
          <div className={styles.logoCircle}>
            <span>SSAI</span>
          </div>
          <h1>Bienvenue !</h1>
          <p>Connectez-vous pour accéder à votre espace personnel.</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.loginFormContainer}>
          <form onSubmit={handleSubmit}>
            {message && <Alert severity={color} sx={{ mb: 2 }}>{message}</Alert>}
            <ToggleButtonGroup
              className={styles.toggleButtonContainer}
              value={role}
              exclusive
              fullWidth
              onChange={(event, newRole) => setRole(newRole)}
              sx={{ width: "100%", mb: 2 }}
              >
              <ToggleButton value="etudiant" sx={{ px: 4 }}>
                <PersonIcon sx={{ mr: 1 }} />
                Étudiant
              </ToggleButton>
              <ToggleButton value="enseignant" sx={{ px: 4 }}>
                <SchoolIcon sx={{ mr: 1 }} />
                Enseignant
              </ToggleButton>
            </ToggleButtonGroup>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Email</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <CircleUserRound />
                </div>
                <input
                  type="text"
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Mot de passe</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Lock />
                </div>
                <input
                  type="password"
                  id="password"
                  value={mot_de_passe}
                  onChange={(e) => setMot_de_passe(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.forgotPassword}>
              <button
                type="button"
                className={styles.forgotPasswordLink}
                onClick={() => navigate('/recuperation')}
              >
                <HelpCircle />
                Mot de passe oublié ?
              </button>
            </div>
            <div className={styles.submitContainer}>
              <button
                type="submit"
                className={styles.loginButton}
              >
                Se connecter
              </button>
            </div>
            <div className={styles.signupLink}>
              <p className={styles.txt}>Pas encore de compte ? <span onClick={() => setTimeout(() => navigate('/inscription'), 1000)}>S'inscrire</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
