import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ViewSubmissions = () => {
  const [submittedExams, setSubmittedExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  }, []);

};

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
      ),
    },
  ];

  return (
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