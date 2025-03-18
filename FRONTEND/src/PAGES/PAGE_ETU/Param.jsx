import React, { useState } from 'react';
import { Card, Switch, Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, BellOutlined } from '@ant-design/icons';

const Param = () => {
    const [form] = Form.useForm();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleSavePassword = (values) => {
        console.log('Nouveau mot de passe :', values.password);
        message.success('Mot de passe mis à jour avec succès !');
    };

    const handleSaveProfile = (values) => {
        console.log('Informations mises à jour :', values);
        message.success('Profil mis à jour avec succès !');
    };

    return (
        <Card title="Paramètres du Compte">
            {/* Section Mot de passe */}
            <Card type="inner" title="Changer le mot de passe" style={{ marginBottom: 20 }}>
                <Form form={form} onFinish={handleSavePassword}>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Veuillez entrer un nouveau mot de passe !' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nouveau mot de passe"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Veuillez confirmer votre mot de passe !' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Les mots de passe ne correspondent pas !'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirmer le mot de passe"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Enregistrer le mot de passe
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Section Notifications */}
            <Card type="inner" title="Notifications" style={{ marginBottom: 20 }}>
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

            {/* Section Informations personnelles */}
            <Card type="inner" title="Informations personnelles">
                <Form onFinish={handleSaveProfile}>
                    <Form.Item
                        name="firstName"
                        rules={[{ required: true, message: 'Veuillez entrer votre prénom !' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Prénom"
                        />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        rules={[{ required: true, message: 'Veuillez entrer votre nom !' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nom"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Veuillez entrer votre email !' },
                            { type: 'email', message: 'Veuillez entrer un email valide !' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Enregistrer les modifications
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Card>
    );
};

export default Param;