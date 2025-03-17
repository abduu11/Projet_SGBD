import React, { useState } from 'react';
import { Card, Select, Button, Row, Col, Statistic, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Données des examens
const examList = [
    { id: 1, subject: 'Mathématiques', daysLeft: 3 },
    { id: 2, subject: 'Physique', daysLeft: 5 },
    { id: 3, subject: 'Informatique', daysLeft: 7 },
    { id: 4, subject: 'Chimie', daysLeft: 10 },
];

// Statistiques des examens
const statsData = {
    totalExams: 4,
    upcomingSoon: 2,
};

const ExamList = () => {
    const [selectedExam, setSelectedExam] = useState(null);

    return (
        <>
            <Card title="Prochains Examens">
                <Select
                    placeholder="Sélectionner un examen"
                    style={{ width: '100%', marginTop: 10 }}
                    onChange={(value) => setSelectedExam(value)}
                >
                    {examList.map((exam) => (
                        <Option key={exam.id} value={exam.subject}>
                            {exam.subject}
                        </Option>
                    ))}
                </Select>
                <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    block
                    style={{ marginTop: 10 }}
                    disabled={!selectedExam}
                >
                    Soumettre un fichier PDF
                </Button>
            </Card>
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col xs={24} sm={12}>
                    <Card>
                        <Statistic title="Total des Examens" value={statsData.totalExams} />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card>
                        <Statistic title="Examens soumis" value={statsData.upcomingSoon} />
                    </Card>
                </Col>
            </Row>
            <Card style={{ marginTop: 20 }}>
                <Title level={4}>Conseils pour se préparer aux examens</Title>
                <Text>
                    - Révisez régulièrement au lieu de tout apprendre à la dernière minute.<br />
                    - Faites des exercices pratiques pour mieux comprendre les concepts.<br />
                    - Prenez des pauses pour optimiser votre concentration.<br />
                    - Dormez suffisamment avant un examen important.
                </Text>
            </Card>
        </>
    );
};

export default ExamList;