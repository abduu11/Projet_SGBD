import { EditOutlined, RobotOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const ViewCorrections = () => {
  const [submissions, setSubmissions] = useState([]);
  const [totalCopies, setTotalCopies] = useState(0);
  const [dejaCorrige, setDejaCorrige] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [autoModalVisible, setAutoModalVisible] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [note, setNote] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [noteIA, setNoteIA] = useState(0);

  const [correctionResult, setCorrectionResult] = useState(null);
  const [correctionEnCours, setCorrectionEnCours] = useState({});

  const idExamen = localStorage.getItem('id_examen');
  const fichier_pdf = localStorage.getItem('fichier_pdf');
  const navigate = useNavigate();

  useEffect(() => {
    if (idExamen) {
      axios
        .post('http://localhost:5000/api/examens/submissions', { id_examen: idExamen })
        .then((response) => {
          setSubmissions(response.data);
          setTotalCopies(response.data.length);
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération des soumissions:", error)
        );
    } else {
      message.error("Aucun ID d'examen trouvé dans localStorage");
    }
  }, [idExamen]);

  const handleCorrectWithAI = async (submission) => {
    setCorrectionEnCours((prev) => ({ ...prev, [submission.id]: true }));
    try {
      // Vérification des paramètres requis
      if (!idExamen || !submission.id || !submission.fichier_pdf) {
        message.error("Données manquantes pour la correction automatique");
        return;
      }

      const response = await axios.post('http://localhost:5000/api/correction', {
        id_examen: idExamen,
        id_copie: submission.id,
        fichier_pdf: submission.fichier_pdf,
      });

      if (!response.data || !response.data.correction) {
        throw new Error("Format de réponse invalide");
      }

      setCorrectionResult(response.data.correction);
      setNoteIA(response.data.correction.note);
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submission.id
            ? {
                ...sub,
                note: response.data.correction.note,
                commentaire: response.data.correction.commentaire,
                status: 'Correction IA proposée'
              }
            : sub
        )
      );
      setSelectedSubmission(submission);
      setAutoModalVisible(true);
      message.success('Correction automatique effectuée avec succès');
    } catch (error) {
      console.error('Erreur lors de la correction automatique:', error);
      
      // Gestion spécifique des erreurs
      if (error.response) {
        // Erreur du serveur avec réponse
        message.error(error.response.data.message || 'Erreur lors de la correction automatique');
      } else if (error.request) {
        // Erreur de requête sans réponse
        message.error('Impossible de contacter le serveur. Vérifiez votre connexion.');
      } else {
        // Erreur de configuration
        message.error('Erreur de configuration: ' + error.message);
      }
      
      setDejaCorrige(true);
    } finally {
      setCorrectionEnCours((prev) => ({ ...prev, [submission.id]: false }));
    }
  };

  const handleSaveCorrection = async () => {
    if (!selectedSubmission) {
      message.error("Aucune soumission sélectionnée");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/enregistrer', {
        id_copie: selectedSubmission.id,
        note: noteIA,
        commentaire: correctionResult.commentaire,
        id_enseignant_validateur: localStorage.getItem('id_utilisateur'),
      });

      if (response.data) {
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === selectedSubmission.id
              ? {
                  ...sub,
                  note: noteIA,
                  commentaire: correctionResult.commentaire,
                  status: 'proposé'
                }
              : sub
          )
        );
        setAutoModalVisible(false);
        message.success('Note attribuée avec succès');
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la note:", error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error("Erreur lors de l'attribution de la note");
      }
    }
  };

  const handleOpenModifyNote = (submission) => {
    if (!submission) {
      message.error("Soumission non sélectionnée !");
      return;
    }
    setSelectedSubmission(submission);
    setNote(submission.note || noteIA || '');
    setCommentaire(submission.commentaire || '');
    setAssignModalVisible(true);
  };

  const handleAssignNoteEtu = async () => {
    if (selectedSubmission) {
      try {
        await axios.post('http://localhost:5000/api/modifier', {
          id_copie: selectedSubmission.id,
          note: note, // Note manuellement modifiée
        });
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub.id === selectedSubmission.id
              ? { ...sub, note: note, commentaire: commentaire, status: 'proposé' }
              : sub
          )
        );
        setAssignModalVisible(false);
        message.success('Note attribuée avec succès');
      } catch (error) {
        console.error("Erreur lors de l'attribution de la note:", error);
        message.error("Erreur lors de l'attribution de la note");
      }
    }
  };

  const handleModalCancel = () => {
    setAssignModalVisible(false);
    setAutoModalVisible(false);
  };

  const handleSeeDetails = (submission) => {
    if (submission && submission.commentaire && submission.note) {
      Modal.info({
        title: "Détails de la Correction IA",
        content: (
          <div>
            <p><strong>Note :</strong> {submission.note}/20</p>
            <p><strong>Commentaires :</strong></p>
            <p>{submission.commentaire}</p>
          </div>
        ),
        onOk: () => {},
      });
    } else {
      message.info("Aucune correction IA disponible pour cette soumission.");
    }
  };
  

  const submissionColumns = [
    {
      title: 'Étudiant',
      key: 'etudiant',
      render: (_, record) => `${record.nom} ${record.prenom}`,
      width: 150,
    },
    {
      title: 'Fichier',
      dataIndex: 'fichier_pdf',
      render: (fileName) =>
        fileName ? (
          <a
            href={`http://localhost:5000/uploads/${fileName}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir le devoir
          </a>
        ) : 'Aucun fichier',
      width: 120,
    },
    {
      title: 'Date de soumission',
      dataIndex: 'date_soumission',
      render: (date) => dayjs(date).format('DD-MM-YYYY HH:mm'),
      width: 180,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      render: (note) => note ? `${note}/20` : 'Non noté',
      width: 100,
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      render: (status) => status || "Non Corrigé",
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={() => { 
              handleCorrectWithAI(record);
            }}
            loading={correctionEnCours[record.id] || false}
            style={{ marginBottom: 5, marginRight: 10 }}
          >
            Correction IA
          </Button>
         
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleOpenModifyNote(record)}
            style={{ marginBottom: 5, marginRight: 10 }}
          >
            Modifier la note + Voir Details IA
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <a
          href={`http://localhost:5000/uploads/${fichier_pdf}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: '10px' }}
        >
          <Button type="default">Voir épreuve</Button>
        </a>
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>

      <h2>Corrections pour l'examen</h2>
      <p>Nombre de copies : {totalCopies}</p>
      
      <Table 
        dataSource={submissions} 
        columns={submissionColumns} 
        rowKey="id" 
        pagination={false} 
      />

      <Modal
        title="Résultat de la Correction Automatique"
        visible={autoModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="close" onClick={() => setAutoModalVisible(false)}>
            Fermer
          </Button>,
          <Button key="validate" type="primary" onClick={handleSaveCorrection}>
            Valider
          </Button>,
        ]}
      >
        {correctionResult && (
          <div>
            <h3>Note proposée : {correctionResult.note}</h3>
            <h4>Commentaires :</h4>
            <p>{correctionResult.commentaire}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Attribuer ou Modifier la note"
        visible={assignModalVisible}
        onOk={handleAssignNoteEtu}
        onCancel={handleModalCancel}
      >
        <div>
          <Input
            type="number"
            value={note || ''}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Entrez une note"
            style={{ marginBottom: 16 }}
          />
          <TextArea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Entrez un commentaire"
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ViewCorrections;