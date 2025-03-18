import React, { useEffect, useState } from 'react';
 import { Link } from 'react-router-dom';
 import { Card, Table, Typography, Layout, Button, Menu } from 'antd';
 import { MenuFoldOutlined, MenuUnfoldOutlined, FileTextOutlined, BookOutlined, CheckSquareOutlined, BarChartOutlined, ReadOutlined } from '@ant-design/icons';
 import { useNavigate } from 'react-router-dom';
 import LogoutIcon from "@mui/icons-material/Logout";
 
 const { Header, Content, Sider } = Layout;
 const { Title } = Typography;
 
 const ViewTeacherExams = () => {
   const [collapsed, setCollapsed] = useState(false);
   const [teacherExams, setTeacherExams] = useState([]);
   const navigate = useNavigate();
 
   useEffect(() => {
     // Remplace cette URL par celle de ton API pour récupérer les examens soumis par le professeur
     fetch('/api/teacher-exams')
       .then((response) => response.json())
       .then((data) => setTeacherExams(data))
       .catch((error) => console.error('Erreur lors de la récupération des examens:', error));
   }, []);
 
   const handleLogout = () => {
     localStorage.clear();
     navigate("/connexion");
   };
 
   const columns = [
     { title: 'ID', dataIndex: 'id', key: 'id' },
     { title: 'Titre', dataIndex: 'title', key: 'title' },
     { title: 'Matière', dataIndex: 'subject', key: 'subject' },
     { title: 'Date de soumission', dataIndex: 'submissionDate', key: 'submissionDate' },
     {
       title: 'Actions',
       key: 'actions',
       render: (text, record) => (
         <Link to={`/exam-student-submissions/${record.id}`} className="view-submissions-link">
           Voir les copies des étudiants
         </Link>
       ),
     },
   ];
 
   return (
     <Content style={{ 
       padding: '0px', 
       background: '#f0f2f5', 
       minHeight: 'calc(100vh - 64px)', 
       display: 'flex', 
       flexDirection: 'column',
       alignItems: 'center' 
     }} >
       <Card style={{ width: '100%', maxWidth: '1200px' }}>
         <Title level={4} style={{ textAlign: 'center' }}>Liste des examens que vous avez créés et soumis</Title>
         <Table columns={columns} dataSource={teacherExams} pagination={false} rowKey="id" />
         <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}> {/* Ajuster la marge inférieure ici */}
           <Link to="/" style={{ fontSize: '16px', textDecoration: 'none', color: '#1890ff' }}>
             ⇐ Retour à l'accueil
           </Link>
         </div>
       </Card>
     </Content>
   );
 };
 
 export default ViewTeacherExams;