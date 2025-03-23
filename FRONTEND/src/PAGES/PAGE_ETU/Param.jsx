import { BellOutlined, LockOutlined, MailOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Switch } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Param = () => {
    const [form] = Form.useForm();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [userInfo, setUserInfo] = useState({
        prenom: '',
        nom: '',
        email: ''
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const id = localStorage.getItem('id_utilisateur');
                const response = await axios.get(`http://localhost:5000/api/parametres/${id}`);
                setUserInfo(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations:', error);
                message.error('Erreur lors de la récupération des informations');
            }
        };

        fetchUserInfo();
    }, []);

    const handleSavePassword = async (values) => {
        try {
            const id = localStorage.getItem('id_utilisateur');
            await axios.post('http://localhost:5000/api/parametres/password', {
                id,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });
            message.success('Mot de passe mis à jour avec succès !');
            form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du mot de passe:', error);
            message.error(error.response?.data?.erreur || 'Erreur lors de la mise à jour du mot de passe');
        }
    };

    return (
        <Card title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <SettingOutlined style={{ fontSize: '24px', color: '#1976d2' }} />
                    <span>Paramètres du Compte</span>
                </div>
        }>
            {/* Section Informations personnelles */}
            <Card type="inner" title="Informations personnelles" style={{ marginBottom: 20 }}>
                <div style={{ padding: '20px' }}>
                    <p><UserOutlined /> Prénom: {userInfo.prenom}</p>
                    <p><UserOutlined /> Nom: {userInfo.nom}</p>
                    <p><MailOutlined /> Email: {userInfo.email}</p>
                </div>
            </Card>


            {/* Section Notifications */}
            <Card type="inner" title="Notifications">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                        <BellOutlined style={{ marginRight: 8 }} />
                        Activer les notifications
                    </span>
                    <Switch
                        checked={notificationsEnabled}
                        onChange={(checked) => setNotificationsEnabled(checked)}
                    />
                </div>
            </Card>
        </Card>
    );
};

export default Param;