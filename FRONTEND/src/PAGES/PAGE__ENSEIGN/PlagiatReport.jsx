import { DownloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, message, Select, Space, Table, Typography } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const { Option } = Select;
const { Title } = Typography;

const PlagiatReport = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchEnseignants = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/enseignants');
        setEnseignants(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des enseignants:', error);
        setError("Erreur lors de la récupération des enseignants");
      } finally {
        setLoading(false);
      }
    };

    fetchEnseignants();
  }, []); 

  const fetchExams = async (enseignantId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/examens/${enseignantId}`);
      setExams(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des examens:', error);
      setError("Erreur lors de la récupération des examens");
    } finally {
      setLoading(false);
    }
  };

  const handleEnseignantChange = (value) => {
    setSelectedEnseignant(value);
    setSelectedExam(null);
    setReports([]);
    if (value) {
      fetchExams(value);
    }
  };

  const fetchPlagiatReport = async () => {
    if (!selectedExam) {
      message.error("Veuillez sélectionner un examen");
      return;
    }
    
    try {
      setLoading(true);
      message.loading({ content: 'Analyse des copies en cours...', key: 'plagiatProgress', duration: 0 });
      
      const response = await axios.get(`http://localhost:5000/api/examens/${selectedExam}/plagiat`);
      
      if (response.data && response.data.rapports) {
        setReports(response.data.rapports);
        message.success({ content: "Rapport généré avec succès !", key: 'plagiatProgress' });
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du rapport de plagiat:", error);
      message.error({ content: "Erreur lors de la génération du rapport", key: 'plagiatProgress' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!selectedExam) {
      message.error("Veuillez sélectionner un examen");
      return;
    }

    try {
      setGeneratingReport(true);
      message.loading({ content: 'Génération du rapport en cours...', key: 'reportProgress' });

      const response = await axios.get(
        `http://localhost:5000/api/examens/${selectedExam}/plagiat/rapport`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_plagiat_${selectedExam}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      message.success({ content: "Rapport généré avec succès !", key: 'reportProgress' });
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      message.error({ content: "Erreur lors de la génération du rapport", key: 'reportProgress' });
    } finally {
      setGeneratingReport(false);
    }
  };

  if (error) {
    return <Alert type="error" message={error} />;
  }

  const columns = [
    { 
      title: "Copie 1", 
      dataIndex: "id_copie1", 
      key: "id_copie1",
      render: (id, record) => `${record.etudiant1_nom} ${record.etudiant1_prenom}`
    },
    { 
      title: "Copie 2", 
      dataIndex: "id_copie2", 
      key: "id_copie2",
      render: (id, record) => `${record.etudiant2_nom} ${record.etudiant2_prenom}`
    },
    { 
      title: "Pourcentage Similarité", 
      dataIndex: "pourcentage_similarite", 
      key: "pourcentage_similarite",
      render: (val) => `${val}%`,
      sorter: (a, b) => a.pourcentage_similarite - b.pourcentage_similarite
    },
    { 
      title: "Date de détection", 
      dataIndex: "date_detection", 
      key: "date_detection",
      render: (date) => new Date(date).toLocaleString() 
    }
  ];

  return (
    <Card
      title={
        <Space>
          <Title level={4}>Rapport de Plagiat par Examen</Title>
          <Button 
            onClick={fetchPlagiatReport} 
            loading={loading} 
            disabled={!selectedExam}
          >
            Générer
          </Button>
          {reports.length > 0 && (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadReport}
              loading={generatingReport}
            >
              Télécharger Rapport
            </Button>
          )}
        </Space>
      }
      style={{ margin: '0px' }}
    >
      <div style={{ marginBottom: 20 }}>
        <Select 
          style={{ width: 300, marginRight: 20 }}
          placeholder="Sélectionnez un enseignant"
          onChange={handleEnseignantChange}
          loading={loading}
        >
          {enseignants.map(ens => (
            <Option key={ens.id} value={ens.id}>{ens.nom} {ens.prenom}</Option>
          ))}
        </Select>

        <Select 
          style={{ width: 300 }}
          placeholder="Sélectionnez un examen"
          onChange={setSelectedExam}
          disabled={!selectedEnseignant || loading}
        >
          {exams.map(exam => (
            <Option key={exam.id} value={exam.id}>{exam.titre}</Option>
          ))}
        </Select>
      </div>

      <Table 
        dataSource={reports}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default PlagiatReport;