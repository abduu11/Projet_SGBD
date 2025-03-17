import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Table, Typography } from 'antd';

const { Title } = Typography;

const ViewCorrections = () => {
  const [corrections, setCorrections] = useState([]);

  useEffect(() => {
    fetch('/api/corrections')
      .then((response) => response.json())
      .then((data) => setCorrections(data))
      .catch((error) => console.error('Erreur lors de la récupération des corrections:', error));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'ID Copie', dataIndex: 'id_copie', key: 'id_copie' },
    { title: 'Note', dataIndex: 'note', key: 'note' },
    { title: 'Commentaires', dataIndex: 'commentaires', key: 'commentaires' },
    { title: 'Statut', dataIndex: 'statut', key: 'statut' },
    { title: 'Enseignant Validateur', dataIndex: 'id_enseignant_validateur', key: 'id_enseignant_validateur' },
    { title: 'Date Correction', dataIndex: 'date_correction', key: 'date_correction' },
  ];

  return (
    <div style={{ padding: '0px', 
      background: '#f0f2f5', 
      minHeight: 'calc(100vh - 64px)', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center' 
      }}>
      <Card style={{ width: '100%', maxWidth: '1200px' }}>
        <Title level={4} style={{ textAlign: 'center' }}>Liste des corrections effectuées</Title>
        <Table columns={columns} dataSource={corrections} pagination={false} rowKey="id" />
        <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '0px' }}>
          <Link to="/" style={{ fontSize: '16px', textDecoration: 'none', color: '#1890ff' }}>
            ⇐ Retour à l'accueil
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ViewCorrections;
