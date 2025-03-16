import { BarChartOutlined, BellOutlined, BookOutlined, FileDoneOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MessageOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import LogoutIcon from "@mui/icons-material/Logout";
import { Badge, Button, Card, Col, Layout, Menu, Row, Select, Statistic, Switch, Table, Typography } from 'antd';
import "antd/dist/reset.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from "./Chatbot.jsx";

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
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/connexion");
    };

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
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light" style={{background: '#1976d2', color: 'white'}} trigger={
                <div
                    style={{
                        background: '#1976d2',
                        color: '#fff',
                        textAlign: 'center',
                        padding: '100vh 0',
                        cursor: 'pointer',
                    }}
                >
                </div>
            }>
                {!collapsed && (<div style={{ textAlign: 'center', padding: 20, color: '#fff', fontSize: 18, background: '#1976d2'}}>Dashboard</div>)}
                <Menu  style={{ background: '#1976d2', color: '#fff' }} theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={(e) => setSelectedMenu(e.key)}>
                    <Menu.Item key="1" icon={<BookOutlined />}>Mes Soumissions</Menu.Item>
                    <Menu.Item key="7" icon={<BookOutlined />}>Mes Examens</Menu.Item>
                    <Menu.Item key="3" icon={<BarChartOutlined />}>Statistiques</Menu.Item>
                    <Menu.Item key="4" icon={<FileDoneOutlined />}>Notes et Appréciations</Menu.Item>
                    <Menu.Item key="5" icon={<MessageOutlined />}>ChatBot</Menu.Item>
                    <Menu.Item key="6" icon={<SettingOutlined />}>Paramètres</Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ background: '#1976d2'}}>
                <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
                    <Title level={4} style={{ margin: 0 }}>Bienvenue, {localStorage.getItem("prenom") + " " + localStorage.getItem("nom")}</Title>
                    <div>
                        <Badge count={5} style={{marginRight: 30}}><BellOutlined style={{ fontSize: 18, marginRight: 30 }} /></Badge>
                        <Button
                            onClick={handleLogout}
                            variant="contained"
                            startIcon={<LogoutIcon />}
                            style={{ backgroundColor: '#1976d2', color: 'white', fontSize: 16} }
                            sx={{
                                marginLeft: 10,
                                backgroundColor: "#1976d2",
                                color: "#1976D2",
                                "&:hover": { backgroundColor: "#1976d5"},
                            }}
                        >
                            Déconnexion
                        </Button>
                    </div>
                </Header>
                <Content style={{ padding: 20, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;