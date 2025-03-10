import React, { useState } from 'react';
import { CircleUserRound, Lock, HelpCircle, Mail } from 'lucide-react';
import { ToggleButtonGroup, ToggleButton, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Connexion.module.css'; 

function Inscription() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMot_de_passe] = useState('');
  const [confirmMot_de_passe, setConfirmMot_de_passe] = useState('');
  const [role, setRole] = useState('etudiant');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const displayCode = (role == 'etudiant') ? 'Numero etudiant' : 'Code ensignant';

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftPanel}>
        <div className={styles.overlay}></div>
        <div className={styles.welcomeContent}>
          <div className={styles.logoCircle}>
            <span>SSAI</span>
          </div>
          <h1>Bienvenue !</h1>
          <p>Inscrivez-vous pour accéder à votre espace personnel.</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.loginFormContainer}>
          <form onSubmit={handleSubmit}>
            {message && <Alert severity={color} sx={{ mb: 2 }}>{message}</Alert>}
            <ToggleButtonGroup
                className={styles.toggleButtonContainer}
                style={{ maxWidth: '500px' }}
                value={role}
                exclusive
                onChange={(event, newRole) => setRole(newRole)}
                fullWidth
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
              <label htmlFor="username">Email</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Mail />
                </div>
                <input
                  type="text"
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="username">{displayCode}</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <CircleUserRound />
                </div>
                <input
                  type="text"
                  id="username"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Mot de passe</label>
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
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Confirmer mot de passe</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Lock />
                </div>
                <input
                  type="password"
                  id="password"
                  value={confirmMot_de_passe}
                  onChange={(e) => setConfirmMot_de_passe(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.forgotPassword}>
              <button
                type="button"
                className={styles.forgotPasswordLink}
              >
              </button>
            </div>
            <div className={styles.submitContainer}>
              <button
                type="submit"
                className={styles.loginButton}
              >
                S'inscrire
              </button>
            </div>
            <div className={styles.signupLink}>
              <p className={styles.txt}>Vous avez déjà un compte ? <span onClick={() => setTimeout(() => navigate('/connexion'), 1000)}>Se connecter</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Inscription;
