import { LineChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Row, Select, Statistic, Table, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [moyenneGenerale, setMoyenneGenerale] = useState(0);
    const [loading, setLoading] = useState(true);
    const [enseignants, setEnseignants] = useState([]);
    const [selectedEnseignant, setSelectedEnseignant] = useState(null);

    useEffect(() => {
        const fetchEnseignants = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/enseignants');
                setEnseignants(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des enseignants:', error);
                message.error('Erreur lors de la récupération des enseignants');
            }
        };

        fetchEnseignants();
    }, []);

    useEffect(() => {
        const fetchNotes = async () => {
            if (!selectedEnseignant) return;

            try {
                const idEtudiant = localStorage.getItem('id_utilisateur');
                const response = await axios.get(`http://localhost:5000/api/notes/${idEtudiant}/${selectedEnseignant}`);
                setNotes(response.data.notes);
                setMoyenneGenerale(response.data.moyenneGenerale);
            } catch (error) {
                console.error('Erreur lors de la récupération des notes:', error);
                message.error('Erreur lors de la récupération des notes');
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [selectedEnseignant]);

    const getAppreciation = (note) => {
        if (note >= 16) return 'Très bien';
        if (note >= 14) return 'Bien';
        if (note >= 12) return 'Assez bien';
        if (note >= 10) return 'Passable';
        return 'Insuffisant';
    };

    const handleReclamation = (note) => {
        message.info('Votre réclamation a été envoyée à l\'enseignant');
    };

    const columns = [
        {
            title: 'Matière',
            dataIndex: 'matiere',
            key: 'matiere',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
            render: (note) => `${note}/20`,
        },
        {
            title: 'Appréciation',
            key: 'appreciation',
            render: (_, record) => getAppreciation(record.note),
        },
        {
            title: 'Date de correction',
            dataIndex: 'date_correction',
            key: 'date_correction',
            render: (date) => new Date(date).toLocaleDateString('fr-FR'),
        },
        {
            title: 'Corrigé par',
            key: 'enseignant',
            render: (_, record) => `${record.prenom_enseignant} ${record.nom_enseignant}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleReclamation(record)}>
                    Faire une réclamation
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Card style={{ marginBottom: 20 }}>
                <Select
                    style={{ width: 300 }}
                    placeholder="Sélectionner un enseignant"
                    onChange={setSelectedEnseignant}
                >
                    {enseignants.map(enseignant => (
                        <Option key={enseignant.id} value={enseignant.id}>
                            {enseignant.prenom} {enseignant.nom}
                        </Option>
                    ))}
                </Select>
            </Card>

            {selectedEnseignant && (
                <>
                    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Moyenne Générale"
                                    value={moyenneGenerale}
                                    suffix="/20"
                                    prefix={<TrophyOutlined />}
                                    precision={2}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Nombre d'examens corrigés"
                                    value={notes.length}
                                    prefix={<LineChartOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Notes et Appréciations">
                        <Table
                            columns={columns}
                            dataSource={notes}
                            rowKey="id"
                            loading={loading}
                            pagination={false}
                            scroll={{ x: true }}
                        />
                    </Card>
                </>
            )}
        </div>
    );
};

export default Notes;