import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1 className="title">📚 Plateforme de Gestion des Examens</h1>
        <p className="subtitle">
          Simplifiez la création, la correction et l'analyse des examens avec un système intelligent et sécurisé.
        </p>
      </header>

      <div className="action-cards">
        <div className="card">
          <Link to="/create-exam" className="action-link">
            <h3>Créer un Examen</h3>
            <p>Créez un examen facilement et attribuez-le à vos étudiants.</p>
          </Link>
        </div>

        <div className="card">
          <Link to="/view-submissions" className="action-link">
            <h3>Voir les Copies Soumises</h3>
            <p>Consultez les copies envoyées par les étudiants.</p>
          </Link>
        </div>

        <div className="card">
          <Link to="/view-corrections" className="action-link">
            <h3>Voir les Corrections</h3>
            <p>Analysez et corrigez les copies de manière automatisée.</p>
          </Link>
        </div>

        <div className="card">
          <Link to="/exam-stats" className="action-link">
            <h3>📊 Voir les Statistiques</h3>
            <p>Consultez les moyennes, la distribution des notes et plus encore.</p>
          </Link>
        </div>

        <div className="card">
          <Link to="/inscription" className="action-link">
            <h3>S'inscrire</h3>
            <p>Créez un compte et commencez à utiliser la plateforme.</p>
          </Link>
        </div>

        <div className="card">
          <Link to="/view-exams" className="action-link">
            <h3>Voir les Examens Soumis</h3>
            <p>Consultez les examens soumis par les étudiants.</p>
          </Link>
        </div>

        {/* Nouveau lien vers Update */}
        <div className="card">
          <Link to="/update" className="action-link">
            <h3>Modifier les Notes</h3>
            <p>Modifiez et validez les notes des étudiants.</p>
          </Link>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Plateforme de Gestion des Examens - Tous droits réservés</p>
      </footer>
    </div>
  );
};

export default Home;
