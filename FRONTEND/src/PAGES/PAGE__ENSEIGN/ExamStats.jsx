import { Card, Layout, Typography, Row, Col, Statistic, Space } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { RiseOutlined, LineChartOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Content } = Layout;

const COLORS = ['#00C49F', '#FF4848'];

const ExamStats = () => {
  const [stats, setStats] = useState({
    moyenne: 0,
    ecartType: 0,
    tauxReussite: 0,
    idExamen: '',
    nomExamen: '',
  });

  useEffect(() => {
    axios.get('/api/exam-stats')
      .then((response) => setStats(response.data))
      .catch((error) => console.error('Erreur lors de la récupération des statistiques:', error));
  }, []);

  const performanceData = [
    { name: 'Réussite', value: stats.tauxReussite },
    { name: 'Échec', value: 100 - stats.tauxReussite },
  ];

  return (
    <Content style={{ padding: '0px', background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: '100%', maxWidth: '1200px', borderRadius: '10px' }}>
        <Title level={3} style={{ textAlign: 'center' }}>📊 Statistiques de l'Examen</Title>
        
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card hoverable>
              <Statistic title="Moyenne des notes" value={stats.moyenne} suffix="/20" prefix={<RiseOutlined />} precision={2} />
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable>
              <Statistic title="Écart-type" value={stats.ecartType} prefix={<LineChartOutlined />} precision={2} />
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable>
              <Statistic title="Taux de réussite" value={stats.tauxReussite} suffix="%" prefix={<CheckCircleOutlined />} precision={2} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="center" style={{ marginTop: '20px' }}>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Title level={5}>📈 Distribution des Notes</Title>
              <BarChart width={400} height={300} data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#007bff" />
              </BarChart>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Title level={5}>📝 Répartition des Performances</Title>
              <PieChart width={400} height={300}>
                <Pie data={performanceData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Card>
          </Col>
        </Row>

        <Title level={4} style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>ℹ️ Explication des statistiques</Title>

        <Card hoverable style={{ marginBottom: '20px', textAlign: 'center', borderLeft: '5px solid #1976d2', borderRight: '5px solid #1976d2' }}>
          <Title level={5}><InfoCircleOutlined /> Moyenne</Title>
          <Text>La moyenne est la somme des notes divisée par le nombre d'étudiants. Elle permet d'évaluer la performance globale des étudiants.</Text>
              {<br/>}
          <Text>-</Text>
        </Card>

        <Card hoverable style={{ marginBottom: '20px', textAlign: 'center', borderLeft: '5px solid #1976d2', borderRight: '5px solid #1976d2' }}>
          <Title level={5}><InfoCircleOutlined /> Écart-type</Title>
          <Text>L'écart-type mesure la dispersion des notes par rapport à la moyenne. Un écart-type élevé signifie une grande variation des notes.</Text>
          {<br/>}
          <Text>-</Text>
        </Card>

        <Card hoverable style={{ marginBottom: '20px', textAlign: 'center', borderLeft: '5px solid #1976d2', borderRight: '5px solid #1976d2' }}>
          <Title level={5}><InfoCircleOutlined /> Taux de réussite</Title>
          <Text>Le taux de réussite représente le pourcentage d'étudiants ayant obtenu une note supérieure ou égale à la note de passage.</Text>
          {<br/>}
          <Text>-</Text>
        </Card>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ fontSize: '16px', textDecoration: 'none', color: '#1890ff' }}>
            ⇐ Retour à l'accueil
          </Link>
        </div>
      </Card>
    </Content>
  );
};

export default ExamStats;
