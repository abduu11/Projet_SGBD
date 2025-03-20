import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Layout, Modal, Table, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const ViewSubmissions = () => {
    const [submittedExams, setSubmittedExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteExamId, setDeleteExamId] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [generatingCorriges, setGeneratingCorriges] = useState({});

    const navigate = useNavigate();

    const fetchExams = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/examens/${localStorage.getItem('id_utilisateur')}`);

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setSubmittedExams(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des examens:', error);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        const generatedCorriges = JSON.parse(localStorage.getItem('generatedCorriges')) || [];
        const updatedCorriges = {};
        generatedCorriges.forEach(id => {
            updatedCorriges[id] = false; // Le généré est complet, pas en cours
        });
        setGeneratingCorriges(updatedCorriges);
    }, []);

    const handleDeleteExam = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/examens/${deleteExamId}`, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            setSubmittedExams(submittedExams.filter(exam => exam.id !== deleteExamId));
            setConfirmModalVisible(false);
            Modal.success({
                title: 'Examen Supprimé',
                content: 'L\'examen a été supprimé avec succès.',
            });
        } catch (error) {
            Modal.error({
                title: 'Erreur',
                content: 'Une erreur est survenue lors de la suppression de l\'examen.',
            });
            console.error('Erreur lors de la suppression de l\'examen:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCorrigeType = async (id_examen) => {
      setGeneratingCorriges(prev => ({ ...prev, [id_examen]: true }));
  
      try {
          const response = await axios.post(`http://localhost:5000/api/examens/generer-corrigeType/`, { id_examen });
  
          if (response.status !== 200) {
              throw new Error(`Erreur ${response.status}: ${response.statusText}`);
          }
  
          if (!response.data.filePath) {
              throw new Error('Le chemin du corrigé type est manquant dans la réponse.');
          }
  
          const generatedCorriges = JSON.parse(localStorage.getItem('generatedCorriges')) || [];
          if (!generatedCorriges.includes(id_examen)) {
              generatedCorriges.push(id_examen);
              localStorage.setItem('generatedCorriges', JSON.stringify(generatedCorriges));
          }
  
          setGeneratingCorriges(prev => ({ ...prev, [id_examen]: false }));
  
          Modal.success({
              title: 'Corrigé Type Généré',
              content: `Le corrigé type a été généré avec succès et est disponible ici : ${response.data.filePath}`,
          });
      } catch (error) {
          console.error('Erreur lors de la génération du corrigé type:', error);
          Modal.error({
              title: 'Erreur',
              content: 'Une erreur est survenue lors de la génération du corrigé type.',
          });
          setGeneratingCorriges(prev => ({ ...prev, [id_examen]: false }));
      }
  };
  

    const columns = [
        { title: 'Titre de l\'examen', dataIndex: 'titre', key: 'titre', width: 200 },
        { title: 'Date de création', dataIndex: 'date_creation', key: 'date_creation', width: 200 },
        {
            title: "Corrigé Type",
            key: "actions",
            render: (_, record) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => handleGenerateCorrigeType(record.id)}
                        loading={generatingCorriges[record.id] === true}
                        disabled={generatingCorriges[record.id] === true}
                    >
                        {generatingCorriges[record.id] === true ? 'Génération en cours...' : 'Générer Corrigé'}
                    </Button>
                    {generatingCorriges[record.id] === false && (
                        <Button
                            type="default"
                            style={{ marginLeft: 8 }}
                            onClick={() => window.open(`http://localhost:5000/uploads/corriges/corrige_${record.id}.pdf`, '_blank')}
                        >
                            Voir le Corrigé
                        </Button>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <a
                        href={`http://localhost:5000/uploads/${record.fichier_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: '10px' }}
                    >
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            style={{ marginRight: 8 }}
                        >
                            Voir l'épreuve
                        </Button>
                    </a>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => { setDeleteExamId(record.id); setConfirmModalVisible(true); }}
                        danger
                        style={{ marginRight: 8, backgroundColor: '#ff4d4f', color: 'white' }}
                    >
                        Supprimer
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Content style={{ padding: '0px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Card style={{ width: '100%', maxWidth: '1200px' }}>
                <Title level={4} style={{ textAlign: 'center' }}>Voir les Examens Créés</Title>
                <p align='center'>Liste des épreuves créées.</p>
                <Table columns={columns} dataSource={submittedExams} pagination={false} rowKey="id" scroll={{ y: 320 }}/>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/" style={{ fontSize: '16px', textDecoration: 'none', color: '#1890ff' }}>
                        ⇐ Retour à l'accueil
                    </Link>
                </div>
            </Card>

            <Modal
                title="Confirmer la suppression"
                visible={confirmModalVisible}
                onOk={handleDeleteExam}
                onCancel={() => setConfirmModalVisible(false)}
                okText="Supprimer"
                cancelText="Annuler"
                confirmLoading={loading}
            >
                <p>Êtes-vous sûr de vouloir supprimer cet examen ? Cette action est irréversible.</p>
            </Modal>
        </Content>
    );
};

export default ViewSubmissions;
