import { RobotOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const { TextArea } = Input;
const { Option } = Select;

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedExam, setSelectedExam] = useState(null);
    const [exams, setExams] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchEnseignants();
        fetchChatHistory();
    }, []);

    useEffect(() => {
        if (selectedProfessor) {
            fetchExams();
        }
    }, [selectedProfessor]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchEnseignants = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/enseignants');
            setEnseignants(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des enseignants:', error);
            message.error('Erreur lors de la récupération des enseignants');
        } finally {
            setLoading(false);
        }
    };

    const fetchExams = async () => {
        if (!selectedProfessor) {
            setExams([]);
            return;
        }
        
        try {
            setLoading(true);
            const idEtudiant = localStorage.getItem('id_utilisateur');
            const response = await axios.get(`http://localhost:5000/api/examens/etudiant/${idEtudiant}?id_enseignant=${selectedProfessor}`);
            setExams(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des examens:', error);
            message.error('Erreur lors de la récupération des examens');
        } finally {
            setLoading(false);
        }
    };

    const fetchChatHistory = async () => {
        try {
            const idUtilisateur = localStorage.getItem('id_utilisateur');
            const response = await axios.get(`http://localhost:5000/api/chat/history/${idUtilisateur}/10`);
            const formattedMessages = response.data.map(msg => ({
                type: 'bot',
                content: msg.reponse,
                timestamp: new Date(msg.date_interaction)
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedExam) {
            message.warning('Veuillez sélectionner un examen et entrer un message');
            return;
        }

        const userMessage = {
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: inputMessage,
                id_examen: selectedExam,
                id_utilisateur: localStorage.getItem('id_utilisateur')
            });

            const botMessage = {
                type: 'bot',
                content: response.data.reponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            message.error('Erreur lors de l\'envoi du message');
        } finally {
            setLoading(false);
        }
    };

    const handleProfessorChange = (value) => {
        setSelectedProfessor(value);
        setExams([]);
        setSelectedExam(null);
    };

    return (
        <Card 
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RobotOutlined style={{ fontSize: '24px', color: '#1976d2' }} />
                    <span>Assistant IA</span>
                </div>
            }
            style={{ 
                height: 'calc(100vh - 150px)', 
                display: 'flex', 
                flexDirection: 'column',
                padding: '0',
                margin: '0',
                background: '#ffffff'
            }}
            styles={{
                body: {
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    height: '100%'
                }
            }}
        >
            <div style={{ padding: '20px', borderBottom: '1px solid #e8e8e8' }}>
                <Select
                    style={{ width: '100%', marginBottom: '20px' }}
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

                <Select
                    style={{ width: '100%' }}
                    placeholder="Sélectionnez un examen"
                    onChange={setSelectedExam}
                    loading={loading}
                    disabled={!selectedProfessor}
                >
                    {exams.map(exam => (
                        <Option key={exam.id} value={exam.id}>
                            {exam.titre}
                        </Option>
                    ))}
                </Select>
            </div>

            <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '20px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                            width: '100%'
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '80%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                background: message.type === 'user' ? '#1976d2' : '#f0f2f5',
                                color: message.type === 'user' ? 'white' : 'black',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                wordBreak: 'break-word'
                            }}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ 
                padding: '20px', 
                borderTop: '1px solid #e8e8e8',
                background: '#ffffff',
                position: 'sticky',
                bottom: 0
            }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <TextArea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        onPressEnter={(e) => {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        style={{
                            borderRadius: '8px',
                            resize: 'none'
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        loading={loading}
                        style={{ 
                            alignSelf: 'flex-end',
                            borderRadius: '8px'
                        }}
                    >
                        Envoyer
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default Chatbot;
