import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Select, Table, Alert, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const { Option } = Select;
const { TextArea } = Input;

const MesExams = () => {
    const [exams, setExams] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [soumission, setSoumission] = useState(null);
    const [commentaire, setCommentaire] = useState('');
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const [isSubmissionModalVisible, setIsSubmissionModalVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);


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

    const handleSubmitCopie = () => {
        const formData = new FormData();
        formData.append('fichier_pdf', selectedFile);
        formData.append('id_etudiant', localStorage.getItem('id_utilisateur'));
        formData.append('id_examen', selectedExam.id);
        formData.append('commentaire', commentaire);

        axios.post('http://localhost:5000/api/soumission', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            message.success('Examen soumis avec succès');
            setSoumission(response.data);
            setIsSubmissionModalVisible(false);
        })
        .catch(error => {
            console.error('Erreur lors de la soumission:', error);
            message.error('Erreur lors de la soumission');
            alert('Vous n\'avez pas de soumission pour cet examen oubien fichier non valide');
            setIsSubmissionModalVisible(false);
        });
        setIsSubmissionModalVisible(false);
    };

    const handleComment = () => {
        axios.post('http://localhost:5000/api/commentaire', { id_etudiant: localStorage.getItem('id_utilisateur'), id_examen: selectedExam.id, commentaire })
            .then(response => {
                message.success('Commentaire ajouté avec succès');
                setIsCommentModalVisible(false);
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout du commentaire:', error);
                message.error('Erreur lors de l\'ajout du commentaire');
                alert('Vous n\'avez pas de soumission pour cet examen');
                setIsCommentModalVisible(false);

            });
    };

    const handleDeleteExam = (id) => {
        const id_etudiant = parseInt(localStorage.getItem('id_utilisateur'));
        const id_examen = parseInt(id);

        if (!id_etudiant || !id_examen) {
            message.error('Veuillez sélectionner un examen');
            return;
        }

        axios.post('http://localhost:5000/api/suppression-copie', { id_etudiant, id_examen })
            .then(response => {
                message.success('Examen supprimé avec succès');
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de l\'examen:', error);
                alert('Vous n\'avez pas de soumission pour cet examen');
                message.error('Erreur lors de la suppression de l\'examen');
                setIsDeleteModalVisible(false);
            });
    };

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

    const showCommentModal = () => {
        setIsCommentModalVisible(true);
    };

    const handleSubmissionCancel = () => {
        setIsSubmissionModalVisible(false);
        setSelectedFile(null);
    };

    const handleCommentCancel = () => {
        setIsCommentModalVisible(false);
    };

    const showSubmissionModal = () => {
        setIsSubmissionModalVisible(true);
    };

    const showDeleteModal = () => {
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const columns = [
        {
            title: 'Titre de l\'examen',
            dataIndex: 'titre',
            key: 'titre',
            width: 80,
        },
        {
            title: 'Date de création',
            dataIndex: 'date_creation',
            key: 'date_creation',
            width: 160,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 500,
            render: (_, record) => (
                <div>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleDownload(record.fichier_pdf)}
                        style={{ marginRight: 8 }}
                    >
                        Voir le sujet
                    </Button>
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={() => {
                            setSelectedExam(record);
                            showSubmissionModal();
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Rendre le devoir
                    </Button>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedExam(record);
                            showCommentModal();
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Commentaire
                    </Button>
                    <Button
    type="primary"
    icon={<DeleteOutlined />}
    onClick={() => {
        setSelectedExam(record);
        showDeleteModal();
    }}
    danger
    style={{ marginRight: 8 }}
>
    Supprimer mon devoir
</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2>Mes Examens</h2>
            <Select
                style={{ width: 300, marginBottom: 20 }}
                placeholder="Choisir un professeur"
                onChange={handleProfessorChange}
            >
                {enseignants.map(enseignant => (
                    <Option key={enseignant.id} value={enseignant.id}>
                        {enseignant.prenom} {enseignant.nom}
                    </Option>
                ))}
            </Select>

            <Table
                columns={columns}
                dataSource={exams}
                pagination={false}
                rowKey="id"
                scroll={{ y: 420 }}
            />

            <Modal
                title={`Ajouter un commentaire pour ${selectedExam?.titre}`}
                visible={isCommentModalVisible}
                onOk={handleComment}
                onCancel={handleCommentCancel}
                okText="Envoyer"
                cancelText="Annuler"
            >
                <TextArea
                    rows={4}
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                />
            </Modal>

            <Modal
                title={`Soumettre un fichier pour ${selectedExam?.titre}`}
                visible={isSubmissionModalVisible}
                onOk={handleSubmitCopie}
                onCancel={handleSubmissionCancel}
                okText="Soumettre"
                cancelText="Annuler"
            >
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    style={{ display: 'block', marginBottom: 10 }}
                />
            </Modal>

            <Modal
                title="Suppression du devoir"
                visible={isDeleteModalVisible}
                onOk={() => handleDeleteExam(selectedExam.id)}
                onCancel={handleDeleteCancel}
                okText="Supprimer"
                cancelText="Annuler"
            >
                <p>Voulez-vous vraiment supprimer ce devoir ?</p>
            </Modal>
        </div>
    );
};

export default MesExams;
