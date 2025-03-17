import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Table, Typography, Layout, Button, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, FileTextOutlined, BookOutlined, CheckSquareOutlined, BarChartOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from "@mui/icons-material/Logout";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const ViewSubmissions = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [submittedExams, setSubmittedExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Remplace cette URL par celle de ton API
    fetch('/api/exams')
      .then((response) => response.json())
      .then((data) => setSubmittedExams(data))
      .catch((error) => console.error('Erreur lors de la récupération des examens:', error));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/connexion");
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Titre de l\'examen', dataIndex: 'title', key: 'title' },
    { title: 'Étudiant', dataIndex: 'student', key: 'student' },
    { title: 'Date de soumission', dataIndex: 'submissionDate', key: 'submissionDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Link to={`/exam-corrections/${record.id}`} className="view-corrections-link">
          Voir les corrections
        </Link>
      ),
    },
  ];

  return (
    <Content style={{ padding: '0px', 
      background: '#f0f2f5', 
      minHeight: 'calc(100vh - 64px)', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center' 
      }}>
      <Card style={{ width: '100%', maxWidth: '1200px' }}>
        <Title level={4} style={{ textAlign: 'center' }}>Voir les Examens Soumis</Title>
        <p>Liste des examens soumis par les étudiants.</p>
        <Table columns={columns} dataSource={submittedExams} pagination={false} rowKey="id" />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ fontSize: '16px', textDecoration: 'none', color: '#1890ff' }}>
            ⇐ Retour à l'accueil
          </Link>
        </div>
      </Card>
    </Content>
  );
};

export default ViewSubmissions;