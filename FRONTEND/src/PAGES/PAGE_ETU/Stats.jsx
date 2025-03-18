import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { Line, Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

// Données pour les graphiques et les statistiques
const performanceData = [
    { month: 'Jan', note: 85 },
    { month: 'Feb', note: 78 },
    { month: 'Mar', note: 90 },
    { month: 'Apr', note: 88 },
    { month: 'May', note: 92 },
];

const pieData = [
    { type: 'Mathématiques', value: 85 },
    { type: 'Physique', value: 78 },
    { type: 'Informatique', value: 90 },
];

const statsData = {
    tauxReussite: 80,
    copiesCorrigees: 120,
    plagiatDetecte: 5,
};

const Stats = () => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Moyenne Générale" value={85} suffix="%" />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Meilleure Note" value={92} suffix="%" />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Examens Passés" value={5} />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col xs={24} sm={12}>
                    <Card title="Évolution des Notes">
                        <Line data={performanceData} xField="month" yField="note" />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card title="Répartition des Notes">
                        <Pie data={pieData} angleField="value" colorField="type" />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Taux de Réussite" value={statsData.tauxReussite} suffix="%" />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Copies Corrigées" value={statsData.copiesCorrigees} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Cas de Plagiat" value={statsData.plagiatDetecte} />
                    </Card>
                </Col>
            </Row>
            <Card style={{ marginTop: 20 }}>
                <Title level={4}>Analyse des Performances</Title>
                <Text>
                    Le taux de réussite global est de {statsData.tauxReussite}%, indiquant une bonne assimilation des cours par les étudiants.
                    La correction automatique a traité {statsData.copiesCorrigees} copies, simplifiant le travail des enseignants.
                    Cependant, {statsData.plagiatDetecte} cas de plagiat ont été détectés, nécessitant une vigilance accrue.
                </Text>
            </Card>
        </>
    );
};

export default Stats;