import React from 'react';
import { Table, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

// Données statiques des examens
const examData = [
    {
        key: '1',
        nom: 'Examen de Mathématiques',
        date: '2023-10-15',
        durée: '2 heures',
        fichier: 'maths_exam.pdf',
    },
    {
        key: '2',
        nom: 'Examen de Physique',
        date: '2023-10-20',
        durée: '1 heure 30 minutes',
        fichier: 'physics_exam.pdf',
    },
    {
        key: '3',
        nom: 'Examen d\'Informatique',
        date: '2023-10-25',
        durée: '2 heures',
        fichier: 'computer_science_exam.pdf',
    },
    {
        key: '4',
        nom: 'Examen de Chimie',
        date: '2023-10-30',
        durée: '1 heure',
        fichier: 'chemistry_exam.pdf',
    },
];

// Colonnes du tableau
const columns = [
    {
        title: 'Nom de l\'examen',
        dataIndex: 'nom',
        key: 'nom',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Durée',
        dataIndex: 'durée',
        key: 'durée',
    },
    {
        title: 'Télécharger',
        key: 'action',
        render: (_, record) => (
            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(record.fichier)}
            >
                Télécharger
            </Button>
        ),
    },
];

// Fonction pour gérer le téléchargement (simulé pour l'instant)
const handleDownload = (filename) => {
    alert(`Téléchargement du fichier : ${filename}`);
    // Ici, vous pouvez ajouter la logique pour télécharger le fichier
};

const MesExams = () => {
    return (
        <Table
            columns={columns}
            dataSource={examData}
            pagination={false}
            scroll={{ x: true }}
        />
    );
};

export default MesExams;