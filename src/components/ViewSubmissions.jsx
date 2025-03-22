import { CheckOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Input, Layout, Modal, Space, Table, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const ViewSubmissions = () => {
    const [submittedExams, setSubmittedExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteExamId, setDeleteExamId] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [generatingCorriges, setGeneratingCorriges] = useState({});
    const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [copies, setCopies] = useState([]);
    const [selectedCopy, setSelectedCopy] = useState(null);
    const [editedNote, setEditedNote] = useState('');
    const [editedCommentaire, setEditedCommentaire] = useState('');
    const [validationModalVisible, setValidationModalVisible] = useState(false);

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

    const fetchCopies = async (id_examen) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/correction/examen/${id_examen}`);
            setCopies(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des copies:', error);
            Modal.error({
                title: 'Erreur',
                content: 'Impossible de récupérer les copies'
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExams();
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

            const generatedCorriges = JSON.parse(localStorage.getItem('generatedCorriges')) || [];
            if (!generatedCorriges.includes(id_examen)) {
                generatedCorriges.push(id_examen);
                localStorage.setItem('generatedCorriges', JSON.stringify(generatedCorriges));
            }

            setGeneratingCorriges(prev => ({ ...prev, [id_examen]: false }));

            Modal.success({
                title: 'Corrigé Type Généré',
                content: 'Le corrigé type a été généré avec succès.',
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

    const handleViewCorrections = async (exam) => {
        setSelectedExam(exam);
        await fetchCopies(exam.id);
        setCorrectionModalVisible(true);
    };

    const handleCorrigerAutomatiquement = async (id_copie, fichier_copie) => {
        try {
            const response = await axios.post('http://localhost:5000/api/correction/automatique', {
                id_examen: selectedExam.id,
                id_copie,
                fichier_copie
            });

            if (response.data) {
                await fetchCopies(selectedExam.id);
                Modal.success({
                    title: 'Correction automatique',
                    content: 'La correction a été générée avec succès'
                });
            }
        } catch (error) {
            console.error('Erreur lors de la correction automatique:', error);
            Modal.error({
                title: 'Erreur',
                content: 'Une erreur est survenue lors de la correction automatique'
            });
        }
    };

    const handleValiderCorrection = async () => {
        try {
            await axios.put(`http://localhost:5000/api/correction/${selectedCopy.id}/valider`, {
                note: editedNote,
                commentaire: editedCommentaire
            });

            setValidationModalVisible(false);
            await fetchCopies(selectedExam.id);
            Modal.success({
                title: 'Succès',
                content: 'La correction a été validée avec succès'
            });
        } catch (error) {
            console.error('Erreur lors de la validation de la correction:', error);
            Modal.error({
                title: 'Erreur',
                content: 'Une erreur est survenue lors de la validation'
            });
        }
    };

    const copiesColumns = [
        { 
            title: 'Étudiant',
            dataIndex: 'nom_etudiant',
            key: 'nom_etudiant',
            width: 200
        },
        { 
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            width: 100,
            render: (note) => note ? `${note}/20` : 'Non corrigé'
        },
        { 
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            width: 150,
            render: (statut) => {
                const status = {
                    'proposee': { color: '#faad14', text: 'Proposition IA' },
                    'validee': { color: '#52c41a', text: 'Validée' },
                    undefined: { color: '#1890ff', text: 'En attente' }
                };
                return (
                    <Text style={{ color: status[statut]?.color }}>
                        {status[statut]?.text}
                    </Text>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {!record.note && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => handleCorrigerAutomatiquement(record.id_copie, record.fichier_copie)}
                        >
                            Corriger avec IA
                        </Button>
                    )}
                    {record.note && record.statut === 'proposee' && (
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedCopy(record);
                                setEditedNote(record.note);
                                setEditedCommentaire(record.commentaire);
                                setValidationModalVisible(true);
                            }}
                        >
                            Modifier/Valider
                        </Button>
                    )}
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => window.open(`http://localhost:5000/uploads/${record.fichier_copie}`, '_blank')}
                    >
                        Voir la copie
                    </Button>
                </Space>
            ),
        },
    ];

    const columns = [
        { title: 'Titre de l\'examen', dataIndex: 'titre', key: 'titre', width: 200 },
        { title: 'Date de création', dataIndex: 'date_creation', key: 'date_creation', width: 200 },
        {
            title: "Corrigé Type",
            key: "corriges",
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
            render: (_, record) => (
                <div>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => handleViewCorrections(record)}
                        style={{ marginRight: 8 }}
                    >
                        Voir les corrections
                    </Button>
                    <a
                        href={`http://localhost:5000/uploads/${record.fichier_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: '10px' }}
                    >
                        <Button
                            type="default"
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

            <Modal
                title={`Corrections - ${selectedExam?.titre}`}
                visible={correctionModalVisible}
                onCancel={() => setCorrectionModalVisible(false)}
                width={1200}
                footer={null}
            >
                <Table
                    columns={copiesColumns}
                    dataSource={copies}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                />
            </Modal>

            <Modal
                title="Validation de la correction"
                visible={validationModalVisible}
                onOk={handleValiderCorrection}
                onCancel={() => setValidationModalVisible(false)}
                width={800}
            >
                {selectedCopy && (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Note proposée par l'IA : </Text>
                            <Input
                                type="number"
                                value={editedNote}
                                onChange={(e) => setEditedNote(e.target.value)}
                                style={{ width: 100 }}
                                min={0}
                                max={20}
                            />
                            <Text> / 20</Text>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Commentaire : </Text>
                            <TextArea
                                value={editedCommentaire}
                                onChange={(e) => setEditedCommentaire(e.target.value)}
                                rows={4}
                            />
                        </div>

                        {selectedCopy.commentaire && (
                            <div>
                                <Text strong>Analyse de l'IA :</Text>
                                <pre style={{ whiteSpace: 'pre-wrap' }}>
                                    {JSON.stringify(JSON.parse(selectedCopy.commentaire), null, 2)}
                                </pre>
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </Content>
    );
};

export default ViewSubmissions; 