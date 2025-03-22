import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Card, Typography, Layout, Space } from 'antd';
import { EyeOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const ViewCorrections = () => {
    const [copies, setCopies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCopy, setSelectedCopy] = useState(null);
    const [editedNote, setEditedNote] = useState('');
    const [editedCommentaire, setEditedCommentaire] = useState('');
    const navigate = useNavigate();

    const fetchCopies = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/correction/examen/${localStorage.getItem('id_examen')}`);
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
        fetchCopies();
    }, []);

    const handleCorrigerAutomatiquement = async (id_copie, fichier_copie) => {
        try {
            const response = await axios.post('http://localhost:5000/api/correction/automatique', {
                id_examen: localStorage.getItem('id_examen'),
                id_copie,
                fichier_copie
            });

            if (response.data) {
                fetchCopies();
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

            setModalVisible(false);
            fetchCopies();
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

    const columns = [
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
                                setModalVisible(true);
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

    return (
        <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={4}>Correction des Copies</Title>
                    <Button onClick={() => navigate(-1)}>Retour</Button>
                </div>
                
                <Table
                    columns={columns}
                    dataSource={copies}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                />
            </Card>

            <Modal
                title="Validation de la correction"
                visible={modalVisible}
                onOk={handleValiderCorrection}
                onCancel={() => setModalVisible(false)}
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

export default ViewCorrections; 