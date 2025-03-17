import React from 'react';
import { Card, Switch, Button } from 'antd';

const Param = () => {
    return (
        <Card title="Paramètres du Compte">
            <Switch checkedChildren="Activé" unCheckedChildren="Désactivé" defaultChecked />
            <Button type="primary" style={{ marginTop: 20 }} block>
                Modifier mes informations
            </Button>
        </Card>
    );
};

export default Param;