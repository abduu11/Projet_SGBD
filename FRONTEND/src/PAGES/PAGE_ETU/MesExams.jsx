import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Select, Table, Upload } from 'antd';
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEnseignants = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/enseignants');
                setEnseignants(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des enseignants:', error);
                message.error('Erreur lors du chargement des enseignants');
            } finally {
                setLoading(false);
            }
        };

        fetchEnseignants();
    }, []);

    useEffect(() => {
        const fetchExams = async () => {
            if (!selectedProfessor) {
                setExams([]);
                return;
            }
            
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/examens/etudiant/${localStorage.getItem('id_utilisateur')}?id_enseignant=${selectedProfessor}`);
                setExams(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des examens:', error);
                message.error('Erreur lors du chargement des examens');
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [selectedProfessor]);

    const handleSubmitCopie = async () => {
        if (!selectedFile) {
            message.warning('Veuillez sélectionner un fichier');
            return;
        }

        if (!selectedExam) {
            message.warning('Veuillez sélectionner un examen');
            return;
        }

        const formData = new FormData();
        formData.append('fichier_pdf', selectedFile);
        formData.append('id_etudiant', localStorage.getItem('id_utilisateur'));
        formData.append('id_examen', selectedExam.id);
        formData.append('commentaire', commentaire);

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/soumission', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            message.success('Examen soumis avec succès');
            setSoumission(response.data);
            setIsSubmissionModalVisible(false);
            setSelectedFile(null);
            setCommentaire('');
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            message.error('Erreur lors de la soumission');
            alert('Vous avez déjà une soumission en cours pour cet examen ou le fichier n\'est pas valide');
        } finally {
            setLoading(false);
        }
    };

    const handleComment = async () => {
        if (!selectedExam) {
            message.warning('Veuillez sélectionner un examen');
            return;
        }

        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/commentaire', {
                id_etudiant: localStorage.getItem('id_utilisateur'),
                id_examen: selectedExam.id,
                commentaire
            });
            message.success('Commentaire ajouté avec succès');
            setIsCommentModalVisible(false);
            setCommentaire('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            message.error('Erreur lors de l\'ajout du commentaire');
            alert('Vous n\'avez pas de soumission pour cet examen');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExam = async (id) => {
        if (!id) {
            message.warning('Veuillez sélectionner un examen');
            return;
        }

        const id_etudiant = parseInt(localStorage.getItem('id_utilisateur'));
        const id_examen = parseInt(id);

        if (!id_etudiant || !id_examen) {
            message.error('Veuillez sélectionner un examen');
            return;
        }

        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/suppression-copie', { id_etudiant, id_examen });
            message.success('Examen supprimé avec succès');
            setIsDeleteModalVisible(false);
            setSelectedExam(null);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'examen:', error);
            message.error('Erreur lors de la suppression de l\'examen');
            alert('Vous n\'avez pas de soumission pour cet examen');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (filename) => {
        if (!filename) {
            message.error('Fichier non disponible');
            return;
        }
        const url = `http://localhost:5000/uploads/${filename}`;
        window.open(url, '_blank');
    };

    const handleProfessorChange = (value) => {
        setSelectedProfessor(value);
        setExams([]);
        setSelectedExam(null);
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
                            setIsSubmissionModalVisible(true);
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
                            setIsCommentModalVisible(true);
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
                            setIsDeleteModalVisible(true);
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
                placeholder="Choisir un enseignant"
                onChange={handleProfessorChange}
                loading={loading}
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
                loading={loading}
            />

            <Modal
                title={`Ajouter un commentaire pour ${selectedExam?.titre}`}
                open={isCommentModalVisible}
                onOk={handleComment}
                onCancel={() => {
                    setIsCommentModalVisible(false);
                    setCommentaire('');
                }}
                okText="Envoyer"
                cancelText="Annuler"
                confirmLoading={loading}
            >
                <TextArea
                    rows={4}
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                />
            </Modal>

            <Modal
                title={`Soumettre un fichier pour ${selectedExam?.titre}`}
                open={isSubmissionModalVisible}
                onOk={handleSubmitCopie}
                onCancel={() => {
                    setIsSubmissionModalVisible(false);
                    setSelectedFile(null);
                    setCommentaire('');
                }}
                okText="Soumettre"
                cancelText="Annuler"
                confirmLoading={loading}
            >
                <Upload
                    beforeUpload={(file) => {
                        setSelectedFile(file);
                        return false;
                    }}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
                </Upload>
                <TextArea
                    rows={4}
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ajouter un commentaire (optionnel)"
                    style={{ marginTop: 16 }}
                />
            </Modal>

            <Modal
                title="Confirmer la suppression"
                open={isDeleteModalVisible}
                onOk={() => handleDeleteExam(selectedExam?.id)}
                onCancel={() => {
                    setIsDeleteModalVisible(false);
                    setSelectedExam(null);
                }}
                okText="Confirmer"
                cancelText="Annuler"
                confirmLoading={loading}
            >
                <p>Êtes-vous sûr de vouloir supprimer votre devoir pour l'examen "{selectedExam?.titre}" ?</p>
            </Modal>
        </div>
    );
};

export default MesExams;
