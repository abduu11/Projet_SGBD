import { Button, Modal, Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const ExamenList = () => {
    const [exams, setExams] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [selectedComment, setSelectedComment] = useState("");
    const [totalCopies, setTotalCopies] = useState(0);
    const id_enseignant = localStorage.getItem('id_utilisateur');

    useEffect(() => {
        axios.post('http://localhost:5000/api/examens/list', { id_enseignant })
            .then(response => setExams(response.data))
            .catch(error => console.error("Erreur lors de la récupération des examens:", error));
    }, [id_enseignant]);

    const fetchSubmissions = (examId) => {
        axios.post(`http://localhost:5000/api/examens/submissions`, { id_examen: examId })
            .then(response => {
                setSubmissions(response.data);
                setTotalCopies(response.data.length);
            })
            .catch(error => console.error("Erreur lors de la récupération des soumissions:", error));
    };

    const viewSubmissions = (examId) => {
        setSelectedExamId(examId);
        fetchSubmissions(examId);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSubmissions([]);
        setTotalCopies(0);
    };

    const viewComment = (comment) => {
        setSelectedComment(comment);
        setIsCommentModalVisible(true);
    };

    const handleCommentModalClose = () => {
        setIsCommentModalVisible(false);
        setSelectedComment("");
    };

    const examColumns = [
        { title: 'Titre de l\'examen', dataIndex: 'titre', key: 'titre' },
        { title: 'Date de création', dataIndex: 'date_creation', key: 'date_creation', 
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY HH:mm') : "Non disponible"
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => viewSubmissions(record.id)}>Voir les soumissions</Button>
            ),
        },
    ];

    const submissionColumns = [
        {
            title: 'Étudiant',
            key: 'etudiant',
            width: 300,
            render: (_, record) => `${record.nom} ${record.prenom}`,
        },
        {
            title: 'Fichier',
            dataIndex: 'fichier_pdf',
            key: 'fichier_pdf',
            render: (fileName) => (
                fileName ? (
                    <Button type="primary">
                        <a href={`http://localhost:5000/uploads/${fileName}`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>
                            Voir le devoir
                        </a>
                    </Button>
                ) : "Aucun fichier"
            ),
            width: 300,
        },
        {
            title: 'Date de soumission',
            dataIndex: 'date_soumission',
            key: 'date_soumission',
            width: 300,
            render: (date) => date ? dayjs(date).format('DD-MM-YYYY HH:mm') : "Non disponible",
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="default" onClick={() => viewComment(record.commentaire)}>
                    Voir commentaire
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h2>Liste des examens</h2>
            <Table dataSource={exams} columns={examColumns} rowKey="id_examen" pagination={false} />

            <Modal
                title={`Nombre de copies : ${totalCopies}`}
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={1000}
            >
                <Table dataSource={submissions} columns={submissionColumns} rowKey="id_copie" pagination={false} />
            </Modal>

            <Modal
                title="Commentaire"
                visible={isCommentModalVisible}
                onCancel={handleCommentModalClose}
                footer={null}
            >
                <p>{selectedComment || "Aucun commentaire disponible"}</p>
            </Modal>
        </div>
    );
};

export default ExamenList;
