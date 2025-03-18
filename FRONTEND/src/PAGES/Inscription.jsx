import React, { useState } from 'react';
import { CircleUserRound, Lock, Mail } from 'lucide-react';
import { ToggleButtonGroup, ToggleButton, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Inscription.module.css';

function Inscription() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMot_de_passe] = useState('');
  const [confirmMot_de_passe, setConfirmMot_de_passe] = useState('');
  const [role, setRole] = useState('etudiant');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const displayCode = role === 'etudiant' ? 'Numero etudiant' : 'Code enseignant';

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !mot_de_passe || !confirmMot_de_passe || !code) {
      setMessage('Assurez-vous de remplir tous les champs');
      setColor('error');
    } else if (mot_de_passe.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères');
      setColor('error');
    } else if (mot_de_passe !== confirmMot_de_passe) {
      setMessage('Les mots de passe ne sont pas identiques');
      setColor('error');
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/authentification/inscription', {
          email,
          code,
          mot_de_passe,
          role,
        });
        navigate('/connexion');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Une erreur est survenue');
        setColor('error');
      }
    }
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
              value={role}
              exclusive
              onChange={(event, newRole) => setRole(newRole)}
              fullWidth
              sx={{ mb: 1 }}
            >
              <ToggleButton value="etudiant" sx={{ px: 3 }}>
                <PersonIcon sx={{ mr: 0.5 }} />
                Étudiant
              </ToggleButton>
              <ToggleButton value="enseignant" sx={{ px: 3 }}>
                <SchoolIcon sx={{ mr: 0.5 }} />
                Enseignant
              </ToggleButton>
            </ToggleButtonGroup>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Mail />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="code">{displayCode}</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <CircleUserRound />
                </div>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="mot_de_passe">Mot de passe</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Lock />
                </div>
                <input
                  type="password"
                  id="mot_de_passe"
                  value={mot_de_passe}
                  onChange={(e) => setMot_de_passe(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmMot_de_passe">Confirmer mot de passe</label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Lock />
                </div>
                <input
                  type="password"
                  id="confirmMot_de_passe"
                  value={confirmMot_de_passe}
                  onChange={(e) => setConfirmMot_de_passe(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.submitContainer}>
              <button type="submit" className={styles.loginButton}>
                S'inscrire
              </button>
            </div>

            <div className={styles.signupLink}>
              <p className={styles.txt}>
                Vous avez déjà un compte ?{' '}
                <span onClick={() => navigate('/connexion')}>Se connecter</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Inscription;