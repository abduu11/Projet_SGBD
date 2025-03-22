import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Card } from 'antd';
import { GraduationCap, FileText, CheckSquare, BarChart3, BookOpen, FileStack	} from 'lucide-react';
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CreateExam from './CreateExam';
import ViewExams from './ViewExams';
import ViewSubmissions from './ViewSubmissions';
import ViewCorrections from './ViewCorrections';
import ExamStats from './ExamStats';
import LogoutIcon from "@mui/icons-material/Logout";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import PlagiatReport from './PlagiatReport';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const DashboardEns = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const navigate = useNavigate();

  const menuItems = [
    { key: 'create-exam', title: 'Créer un Examen', icon: <GraduationCap /> },
    { key: 'submissions', title: 'Examens Soumis', icon: <FileText /> },
    { key: 'stats', title: 'Statistiques', icon: <BarChart3 /> },
    { key: 'exams', title: 'Copies Soumises', icon: <BookOpen /> },
    { key: 'plagiat', title: 'Rapport de Plagiat', icon: <FileStack /> },
  ];

  const renderContent = () => {
    switch (selectedSection) {
      case 'create-exam':
        return <CreateExam />;
      case 'submissions':
        return <ViewSubmissions />;
      case 'stats':
        return <ExamStats />;
      case 'exams':
        return <ViewExams />;
      case 'plagiat':
        return <PlagiatReport />;
      default:
        return <div style={{ textAlign: 'center', color: '#777', fontSize: '1.2rem' }}>Sélectionnez une option pour commencer</div>;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/connexion");
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#1976d2', color: '#fff' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light" style={{ background: '#1976d2', color: 'white' }} trigger={
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
        {!collapsed && (<div style={{ textAlign: 'center', padding: 20, color: '#fff', fontSize: 18, background: '#1976d2' }}>Dashboard</div>)}
        <Menu style={{ background: '#1976d2', color: '#fff' }} theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={(e) => setSelectedSection(e.key)}>
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.title}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ background: '#1976d2' }}>
        <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
          <Title level={4} style={{ margin: 0 }}>Bienvenue, {localStorage.getItem("prenom") + " " + localStorage.getItem("nom")}</Title>
          <Button
            onClick={handleLogout}
            variant="contained"
            startIcon={<LogoutIcon />}
            style={{ backgroundColor: '#1976d2', color: 'white', fontSize: 16, padding: '20px' }}
          >
            {<LogoutIcon />}Déconnexion
          </Button>
        </Header>
        <Content style={{ padding: 20, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', overflowY: 'auto'}}>
          <Card>
            <Title level={4} style={{ textAlign: 'center' }}>📚 Plateforme de Gestion des Examens</Title>
            <p align='center'>Simplifiez la création, la correction et l'analyse des examens avec un système intelligent et sécurisé.</p>
          </Card>
          <div style={{ marginTop: 20 }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardEns;