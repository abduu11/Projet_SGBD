import { BarChartOutlined, LineChartOutlined, TrophyOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { Card, Col, Row, Select, Statistic, Typography, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

const Stats = () => {
    const [enseignants, setEnseignants] = useState([]);
    const [selectedEnseignant, setSelectedEnseignant] = useState(null);
    const [stats, setStats] = useState({
        moyenneGenerale: 0,
        nombreExamens: 0,
        meilleureNote: 0,
        pireNote: 20,
        distributionNotes: [],
        evolutionNotes: []
    });
    const [loading, setLoading] = useState(false);

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
        const fetchStats = async () => {
            if (!selectedEnseignant) return;

            setLoading(true);
            try {
                const idEtudiant = localStorage.getItem('id_utilisateur');
                const response = await axios.get(`http://localhost:5000/api/statistiques/${idEtudiant}/${selectedEnseignant}`);
                if (response.data) {
                    setStats(response.data);
                } else {
                    message.warning('Aucune statistique disponible pour cet enseignant');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
                message.error('Erreur lors de la récupération des statistiques');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedEnseignant]);

    const getAppreciation = (note) => {
        if (note >= 16) return 'Très bien';
        if (note >= 14) return 'Bien';
        if (note >= 12) return 'Assez bien';
        if (note >= 10) return 'Passable';
        return 'Insuffisant';
    };

    return (
        <div>
            <Card style={{ marginBottom: 20 }}
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BarChartOutlined style={{ fontSize: '24px', color: '#1976d2' }} />
                    <span>Statistiques</span>
                </div>
            }
            >
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
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <Card>
                                <Statistic
                                    title="Moyenne Générale"
                                    value={stats.moyenneGenerale}
                                    suffix="/20"
                                    prefix={<TrophyOutlined />}
                                    precision={2}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card>
                                <Statistic
                                    title="Meilleure Note"
                                    value={stats.meilleureNote}
                                    suffix="/20"
                                    prefix={<BarChartOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card>
                                <Statistic
                                    title="Nombre d'examens"
                                    value={stats.nombreExamens}
                                    prefix={<LineChartOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                        <Col xs={24} sm={12}>
                            <Card title="Évolution des Notes">
                                <Line
                                    data={stats.evolutionNotes}
                                    xField="date"
                                    yField="note"
                                    point={{
                                        size: 5,
                                        shape: 'diamond',
                                    }}
                                    label={{
                                        style: {
                                            fill: '#aaa',
                                        },
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Card title="Distribution des Notes">
                                <Pie
                                    data={stats.distributionNotes}
                                    angleField="value"
                                    colorField="type"
                                    radius={0.8}
                                    label={{
                                        type: 'outer',
                                        content: '{name} {percentage}%',
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card style={{ marginTop: 20 }}>
                        <Title level={4}>Analyse des Performances</Title>
                        <p>
                            Votre moyenne générale pour cette matiere est de {stats.moyenneGenerale}/20, ce qui correspond à une appréciation "{getAppreciation(stats.moyenneGenerale)}".
                            Vous avez passé {stats.nombreExamens} examens avec une meilleure note de {stats.meilleureNote}/20.
                        </p>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Stats;