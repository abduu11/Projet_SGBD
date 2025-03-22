import { CheckCircleOutlined, InfoCircleOutlined, LineChartOutlined, RiseOutlined, TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import { Card, Col, Layout, message, Progress, Row, Select, Statistic, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;

const COLORS = ['#00C49F', '#FF4848', '#FFBB28', '#FF8042'];

const ExamStats = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [stats, setStats] = useState({
    moyenne: 0,
    ecartType: 0,
    tauxReussite: 0,
    distributionNotes: [],
    nombreEtudiants: 0,
    noteMax: 0,
    noteMin: 0,
    mediane: 0,
    tendances: {
      prevision: 0,
      confiance: 0,
      facteurs: []
    },
    analyse: {
      niveau: '',
      commentaire: '',
      recommandations: []
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const enseignantId = localStorage.getItem('id_utilisateur');
        const response = await axios.get(`http://localhost:5000/api/examens/${enseignantId}`);
        setExams(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des examens:', error);
        message.error('Erreur lors de la récupération des examens');
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedExam) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/examens/${selectedExam}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        message.error('Erreur lors de la récupération des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedExam]);

  const performanceData = [
    { name: 'Réussite', value: stats.tauxReussite },
    { name: 'Échec', value: 100 - stats.tauxReussite },
  ];

  const getNiveauPerformance = (moyenne) => {
    if (moyenne >= 15) return { niveau: 'Excellent', couleur: '#52c41a' };
    if (moyenne >= 12) return { niveau: 'Bon', couleur: '#1890ff' };
    if (moyenne >= 10) return { niveau: 'Satisfaisant', couleur: '#faad14' };
    return { niveau: 'À améliorer', couleur: '#f5222d' };
  };

  const niveau = getNiveauPerformance(stats.moyenne);

  return (
    <Content style={{ padding: '0px', background: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: '100%', maxWidth: '1200px', borderRadius: '10px' }}>
        <Title level={3} style={{ textAlign: 'center' }}>📊 Statistiques de l'Examen</Title>
        
        <div style={{ marginBottom: 20 }}>
          <Select
            style={{ width: '100%', maxWidth: 400 }}
            placeholder="Sélectionnez un examen"
            onChange={setSelectedExam}
            loading={loading}
          >
            {exams.map(exam => (
              <Option key={exam.id} value={exam.id}>{exam.titre}</Option>
            ))}
          </Select>
        </div>

        {selectedExam && (
          <>
            <Card 
              title="Performance Globale" 
              style={{ marginBottom: '20px', borderLeft: `5px solid ${niveau.couleur}` }}
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic 
                    title="Niveau de Performance" 
                    value={niveau.niveau}
                    prefix={<TrophyOutlined style={{ color: niveau.couleur }} />}
                  />
                </Col>
                <Col span={8}>
                  <Progress 
                    type="circle" 
                    percent={stats.tauxReussite} 
                    format={percent => `${percent}%`}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Tendance Prévue" 
                    value={stats.tendances.prevision}
                    suffix="/20"
                    prefix={<RiseOutlined />}
                    precision={2}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Statistiques Détaillées" style={{ marginBottom: '20px' }}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card hoverable>
                    <Statistic 
                      title="Moyenne" 
                      value={stats.moyenne} 
                      suffix="/20" 
                      prefix={<RiseOutlined />} 
                      precision={2} 
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card hoverable>
                    <Statistic 
                      title="Note Maximale" 
                      value={stats.noteMax} 
                      suffix="/20" 
                      prefix={<TrophyOutlined style={{ color: '#52c41a' }} />} 
                      precision={2} 
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card hoverable>
                    <Statistic 
                      title="Note Minimale" 
                      value={stats.noteMin} 
                      suffix="/20" 
                      prefix={<WarningOutlined style={{ color: '#f5222d' }} />} 
                      precision={2} 
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card hoverable>
                    <Statistic 
                      title="Médiane" 
                      value={stats.mediane} 
                      suffix="/20" 
                      prefix={<LineChartOutlined />} 
                      precision={2} 
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                  <Card hoverable>
                    <Statistic 
                      title="Écart-type" 
                      value={stats.ecartType} 
                      prefix={<LineChartOutlined />} 
                      precision={2} 
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card hoverable>
                    <Statistic 
                      title="Taux de réussite" 
                      value={stats.tauxReussite} 
                      suffix="%" 
                      prefix={<CheckCircleOutlined />} 
                      precision={2} 
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card hoverable>
                    <Statistic 
                      title="Nombre d'étudiants" 
                      value={stats.nombreEtudiants} 
                      prefix={<InfoCircleOutlined />} 
                    />
                  </Card>
                </Col>
              </Row>
            </Card>

            <Card title="Visualisations" style={{ marginBottom: '20px' }}>
              <Row gutter={[16, 16]} justify="center">
                <Col xs={24} md={12}>
                  <Card hoverable style={{ height: '100%' }}>
                    <Title level={5}>📈 Distribution des Notes</Title>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <Text type="secondary">
                        Ce graphique montre la répartition des notes obtenues par les étudiants
                      </Text>
                    </div>
                    <BarChart 
                      width={400} 
                      height={300} 
                      data={stats.distributionNotes}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="note" 
                        label={{ value: 'Note (/20)', position: 'bottom', offset: -7 }}
                      />
                      <YAxis 
                        label={{ 
                          value: 'Nombre d\'étudiants', 
                          angle: -90, 
                          position: 'insideLeft',
                          offset: 10
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} étudiants`, 'Nombre']}
                        labelFormatter={(label) => `Note: ${label}/20`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="nombre" 
                        name="Repartition des notes en fonction des étudiants"
                        fill="#1890ff"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card hoverable style={{ height: '100%' }}>
                    <Title level={5}>📝 Répartition des Performances</Title>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <Text type="secondary">
                        Ce graphique montre la proportion d'étudiants ayant réussi ou échoué
                      </Text>
                    </div>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <PieChart width={400} height={300}>
                        <Pie 
                          data={performanceData} 
                          dataKey="value" 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={100} 
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index]}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => `${value}%`}
                          labelFormatter={(label) => label}
                        />
                        <Legend />
                      </PieChart>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>

            <Card 
              title="Analyse et Recommandations" 
              style={{ marginBottom: '20px', background: '#fafafa' }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={5}>
                    <InfoCircleOutlined /> Analyse de la Performance
                  </Title>
                  <Paragraph>
                    {stats.analyse.commentaire}
                  </Paragraph>
                </Col>
                <Col span={24}>
                  <Title level={5}>
                    <WarningOutlined /> Recommandations
                  </Title>
                  <ul>
                    {stats.analyse.recommandations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Card>

            <Card title="Guide d'Interprétation" style={{ marginBottom: '20px' }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={5}><InfoCircleOutlined /> Comment interpréter ces statistiques ?</Title>
                  <Paragraph>
                    Les statistiques présentées ci-dessus permettent d'évaluer la performance globale de la classe et d'identifier les points d'amélioration potentiels. Voici quelques points clés à considérer :
                  </Paragraph>
                  <ul>
                    <li>La moyenne et la médiane donnent une vue d'ensemble de la performance</li>
                    <li>L'écart-type mesure la dispersion des notes (plus il est élevé, plus les résultats sont hétérogènes)</li>
                    <li>Le taux de réussite indique la proportion d'étudiants ayant atteint les objectifs</li>
                    <li>La distribution des notes permet d'identifier les tendances et les anomalies</li>
                    <li>Les notes maximale et minimale donnent une idée de l'étendue des résultats</li>
                  </ul>
                </Col>
              </Row>
            </Card>
          </>
        )}

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
