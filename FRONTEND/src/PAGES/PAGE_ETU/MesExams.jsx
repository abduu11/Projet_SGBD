import { DownloadOutlined } from '@ant-design/icons';
import { Button, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

const MesExams = () => {
    const [exams, setExams] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/enseignants')
            .then(response => response.json())
            .then(data => setEnseignants(data))
            .catch(error => console.error('Erreur lors du chargement des enseignants:', error));
    }, []);

    useEffect(() => {
        if (selectedProfessor) {
            fetch(`http://localhost:5000/api/examens/etudiant/${localStorage.getItem('id_utilisateur')}?id_enseignant=${selectedProfessor}`)
                .then(response => response.json())
                .then(data => setExams(data))
                .catch(error => console.error('Erreur lors du chargement des examens:', error));
        }
    }, [selectedProfessor]);

    const handleDownload = (filename) => {
        const url = `http://localhost:5000/uploads/${filename}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleProfessorChange = (value) => {
        setSelectedProfessor(value);
    };

    const columns = [
        {
            title: 'Nom de l\'examen',
            dataIndex: 'titre',
            key: 'titre',
        },
        {
            title: 'Date de création',
            dataIndex: 'date_creation',
            key: 'date_creation',
        },
        {
            title: 'Télécharger',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(record.fichier_pdf)}
                >
                    Télécharger
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>Mes Examens</h2>
            <Select
                style={{ width: 200, marginBottom: 20 }}
                placeholder="Choisir un professeur"
                onChange={handleProfessorChange}
            >
                {enseignants.map(enseignant => (
                    <Option key={enseignant.id} value={enseignant.id}>
                        {enseignant.nom} {enseignant.prenom}
                    </Option>
                ))}
            </Select>

            <Table
                columns={columns}
                dataSource={exams}
                pagination={false}
                rowKey="id"
            />
        </div>
    );
};

export default MesExams;