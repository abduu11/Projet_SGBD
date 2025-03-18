import React from 'react';
import { Card, Table } from 'antd';

// Données pour les notes
const notesData = [
    { key: '1', matière: 'Mathématiques', note: 85, appréciation: 'Très bien' },
    { key: '2', matière: 'Physique', note: 78, appréciation: 'Bien' },
    { key: '3', matière: 'Informatique', note: 90, appréciation: 'Excellent' },
];

// Colonnes du tableau
const columns = [
    { title: 'Matière', dataIndex: 'matière', key: 'matière' },
    { title: 'Note', dataIndex: 'note', key: 'note' },
    { title: 'Appréciation', dataIndex: 'appréciation', key: 'appréciation' },
];

const Notes = () => {
    return (
        <Card title="Notes et Appréciations">
            <Table
                columns={columns}
                dataSource={notesData}
                pagination={false}
                scroll={{ x: true }}
            />
        </Card>
    );
};

export default Notes;