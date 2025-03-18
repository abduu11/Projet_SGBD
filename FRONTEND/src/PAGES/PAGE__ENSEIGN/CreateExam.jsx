import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Ajout de l'import
import './CreateExam.css';

const CreateExam = () => {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [files, setFiles] = useState([]);

  const handleTitleChange = (e) => setExamTitle(e.target.value);
  const handleDescriptionChange = (e) => setExamDescription(e.target.value);
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Examen et fichiers soumis avec succès !');
  };

  return (
    <div className="create-exam-container">
      <header className="header">
        <h1>Créer un Examen</h1>
        <p>Définissez les détails de votre examen et ajoutez des questions et fichiers.</p>
      </header>

      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-group">
          <label htmlFor="examTitle">Titre de l'examen</label>
          <input
            type="text"
            id="examTitle"
            value={examTitle}
            onChange={handleTitleChange}
            placeholder="Examen sur les bases de données"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="examDescription">Description de l'examen</label>
          <textarea
            id="examDescription"
            value={examDescription}
            onChange={handleDescriptionChange}
            placeholder="Description courte de l'examen..."
            required
          />
        </div>

        <div className="questions-section">
          <h3>Ajouter des questions</h3>
          {questions.map((question, index) => (
            <div key={index} className="form-group question-input">
              <label htmlFor={`question-${index}`}>Question {index + 1}</label>
              <textarea
                id={`question-${index}`}
                value={question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder="Entrez la question ici..."
                required
              />
            </div>
          ))}

          <button type="button" className="add-question-btn" onClick={addQuestion}>
            Ajouter une question
          </button>
        </div>

        <div className="file-upload-section">
          <h3>Ajouter des fichiers</h3>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf, .doc, .docx, .jpg, .png, .txt"
          />
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={index} className="file-item">
                {file.name}
                <button type="button" className="remove-file-btn" onClick={() => removeFile(index)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="submit-btn">
          Créer l'examen
        </button>
      </form>

      {/* Lien de retour à la page d'accueil */}
      <div className="back-to-home">
        <Link to="/" className="back-link">
          ⇐ Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default CreateExam;
