import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';  // Importation de Link
import './ExamStats.css';

const ExamStats = () => {
  // Simuler des données de notes récupérées depuis une API
  const [grades, setGrades] = useState([10, 14, 8, 16, 19, 12, 9, 15, 17, 20, 5, 13, 18]);

  // Calcul de la moyenne
  const average = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);

  // Générer des données pour l'histogramme
  const histogramData = [
    { range: '0-5', count: grades.filter(g => g <= 5).length },
    { range: '6-10', count: grades.filter(g => g > 5 && g <= 10).length },
    { range: '11-15', count: grades.filter(g => g > 10 && g <= 15).length },
    { range: '16-20', count: grades.filter(g => g > 15).length },
  ];

  // Répartition des performances
  const performanceData = [
    { name: 'Excellents (16-20)', value: grades.filter(g => g >= 16).length },
    { name: 'Moyens (10-15)', value: grades.filter(g => g >= 10 && g < 16).length },
    { name: 'Faibles (0-9)', value: grades.filter(g => g < 10).length },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF4848'];

  return (
    <div className="exam-stats-container">
      <h1>📊 Statistiques de l'Examen</h1>
      <p>Moyenne des notes : <strong>{average}/20</strong></p>

      {/* Histogramme des notes */}
      <div className="chart-container">
        <h2>📈 Distribution des Notes</h2>
        <BarChart width={500} height={300} data={histogramData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#007bff" />
        </BarChart>
      </div>

      {/* Diagramme en Camembert des performances */}
      <div className="chart-container">
        <h2>📝 Répartition des Performances</h2>
        <PieChart width={400} height={300}>
          <Pie data={performanceData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
            {performanceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Lien de retour à la page d'accueil */}
      <div className="back-to-home">
        <Link to="/" className="back-link">
          ⇐ Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default ExamStats;
