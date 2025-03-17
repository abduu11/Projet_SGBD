import React, { useState } from 'react';
import { Layout, Menu, Card, Typography, Row, Col, Statistic, Badge, Button, Table, Select } from 'antd';
import { BookOutlined, BarChartOutlined, FileDoneOutlined, MessageOutlined, SettingOutlined, BellOutlined, MenuUnfoldOutlined, MenuFoldOutlined, UploadOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import "antd/dist/reset.css";
import Chatbot from "./Chatbot.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from 'react-router-dom'; 
import ExamList from './ExamList.jsx';
import Stats from './Stats.jsx';
import Notes from './Notes.jsx';
import Param from './Param.jsx';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('1');
    const [selectedExam, setSelectedExam] = useState(null);
    const navigate = useNavigate(); 

    const handleLogout = () => {
        
        localStorage.removeItem("token");
        localStorage.removeItem("prenom");
        localStorage.removeItem("nom");
        localStorage.removeItem("role");
        navigate("/connexion");
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case '1':
                return (<ExamList />);
            case '3':
                return (<Stats />);
            case '4':
                return (<Notes />);
            case '5':
                return (<Chatbot />);
            case '6':
                return (<Param />);
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
                                onClick={handleLogout} // Ajoutez la fonction handleLogout ici
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