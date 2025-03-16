import React, { useState } from 'react';
import { Layout, Menu, Card, Typography, Row, Col, Statistic, Badge, Button, Table, Select } from 'antd';
import { BookOutlined, BarChartOutlined, FileDoneOutlined, MessageOutlined, SettingOutlined, BellOutlined, MenuUnfoldOutlined, MenuFoldOutlined, UploadOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import "antd/dist/reset.css";
import Chatbot from "./Chatbot.jsx";
import LogoutIcon from "@mui/icons-material/Logout";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

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

const examList = [
    { id: 1, subject: 'Mathématiques', daysLeft: 3 },
    { id: 2, subject: 'Physique', daysLeft: 5 },
    { id: 3, subject: 'Informatique', daysLeft: 7 },
    { id: 4, subject: 'Chimie', daysLeft: 10 },
];

const notesData = [
    { key: '1', matière: 'Mathématiques', note: 85, appréciation: 'Très bien' },
    { key: '2', matière: 'Physique', note: 78, appréciation: 'Bien' },
    { key: '3', matière: 'Informatique', note: 90, appréciation: 'Excellent' },
];

const columns = [
    { title: 'Matière', dataIndex: 'matière', key: 'matière' },
    { title: 'Note', dataIndex: 'note', key: 'note' },
    { title: 'Appréciation', dataIndex: 'appréciation', key: 'appréciation' },
];

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('1');
    const [selectedExam, setSelectedExam] = useState(null);

    const renderContent = () => {
        switch (selectedMenu) {
            case '1':
                return (
                    <>
                        <Card title="Prochains Examens">
                            <Select
                                placeholder="Sélectionner un examen"
                                style={{ width: '100%', marginTop: 10 }}
                                onChange={(value) => setSelectedExam(value)}
                            >
                                {examList.map(exam => <Option key={exam.id} value={exam.subject}>{exam.subject}</Option>)}
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
                            <Col xs={24} sm={12}><Card><Statistic title="Total des Examens" value={statsData.totalExams} /></Card></Col>
                            <Col xs={24} sm={12}><Card><Statistic title="Examens soumis" value={statsData.upcomingSoon} /></Card></Col>
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
            case '3':
                return (
                    <>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8}><Card><Statistic title="Moyenne Générale" value={85} suffix="%" /></Card></Col>
                            <Col xs={24} sm={8}><Card><Statistic title="Meilleure Note" value={92} suffix="%" /></Card></Col>
                            <Col xs={24} sm={8}><Card><Statistic title="Examens Passés" value={5} /></Card></Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                            <Col xs={24} sm={12}><Card title="Évolution des Notes"><Line data={performanceData} xField='month' yField='note' /></Card></Col>
                            <Col xs={24} sm={12}><Card title="Répartition des Notes"><Pie data={pieData} angleField='value' colorField='type' /></Card></Col>
                        </Row>
                        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                            <Col xs={24} sm={8}><Card><Statistic title="Taux de Réussite" value={statsData.tauxReussite} suffix="%" /></Card></Col>
                            <Col xs={24} sm={8}><Card><Statistic title="Copies Corrigées" value={statsData.copiesCorrigees} /></Card></Col>
                            <Col xs={24} sm={8}><Card><Statistic title="Cas de Plagiat" value={statsData.plagiatDetecte} /></Card></Col>
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
            case '4':
                return (
                    <Card title="Notes et Appréciations">
                        <Table columns={columns} dataSource={notesData} pagination={false} scroll={{ x: true }} />
                    </Card>
                );
            case '5':
                return (
                    <Chatbot />
                );
            case '6':
                return (
                    <Card title="Paramètres du Compte">
                        <Switch checkedChildren unCheckedChildren defaultChecked />
                        <Button type="primary" style={{ marginTop: 20 }} block>Modifier mes informations</Button>
                    </Card>
                );
            default:
                return <Card title="Section en développement">Contenu à venir...</Card>;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#1976d2', color: '#fff' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} breakpoint="lg" collapsedWidth="80" style={{ background: '#1976d2' }}>
                <div style={{ textAlign: 'center', padding: 20, fontSize: 18, color: '#fff' }}>
                    {!collapsed ? 'Dashboard' : 'D'}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={(e) => setSelectedMenu(e.key)} style={{ background: '#1976d2' }}>
                    <Menu.Item key="1" icon={<BookOutlined />}>Mes Soumissions</Menu.Item>
                    <Menu.Item key="7" icon={<BookOutlined />}>Mes Examens</Menu.Item>
                    <Menu.Item key="3" icon={<BarChartOutlined />}>Statistiques</Menu.Item>
                    <Menu.Item key="4" icon={<FileDoneOutlined />}>Notes et Appréciations</Menu.Item>
                    <Menu.Item key="5" icon={<MessageOutlined />}>ChatBot</Menu.Item>
                    <Menu.Item key="6" icon={<SettingOutlined />}>Paramètres</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#fff' }}>
                    <Row justify="space-between" align="middle" style={{ padding: '0 20px' }}>
                        <Col>
                            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
                        </Col>
                        <Col>
                            <Title level={4} style={{ margin: 0 }}>Bienvenue, {localStorage.getItem("prenom")} {localStorage.getItem("nom")}</Title>
                        </Col>
                        <Col>
                            <Badge count={5}><BellOutlined style={{ fontSize: 18 }} /></Badge>
                            <Button
                                icon={<LogoutIcon />}
                                style={{ marginLeft: 10, backgroundColor: '#1976d2', color: '#fff' }}
                                onClick={() => {}}
                            >
                                Déconnexion
                            </Button>
                        </Col>
                    </Row>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 112px)' }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;