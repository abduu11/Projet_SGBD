import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography, Upload } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle } from '@mui/material';
 
 const { Title } = Typography;
 const { TextArea } = Input;
 
 const CreateExam = () => {
   const [examTitle, setExamTitle] = useState('');
   const [examDescription, setExamDescription] = useState('');
   const [files, setFiles] = useState([]);
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState('');
   const [color, setColor] = useState('');
 
   const handleTitleChange = (e) => setExamTitle(e.target.value);
   const handleDescriptionChange = (e) => setExamDescription(e.target.value);
   const handleFileChange = ({ fileList }) => setFiles(fileList);
 
   const handleSubmit = async () => {
     setLoading(true);
     const formData = new FormData();
     formData.append('titre', examTitle);
     formData.append('description', examDescription);
     formData.append('id_enseignant', localStorage.getItem('id_utilisateur'));
 
     if (files.length > 0) {
       formData.append('fichier_pdf', files[0].originFileObj);
     }
 
     console.log(files)  ;
 
     try {
       const response = await axios.post('http://localhost:5000/api/examens', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
       });
 
       setMessage('Examen soumis avec succès !');
       setColor('success');
 
       setExamTitle('');
       setExamDescription('');
       setFiles([]);
       setTimeout(() => setMessage(''), 5000);
     } catch (error) {
       setMessage('Échec de la soumission. Veuillez réessayer.');
       setColor('error');
 
     setTimeout(() => setMessage(''), 5000);
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '0px 0', overflow: 'hidden' }}>
       {message && (
         <Alert
           severity={color} 
           onClose={() => setMessage('')}
           sx={{ marginBottom: 2, width: '100%', maxWidth: '600px', borderRadius: '10px' }}
         >
           <AlertTitle>{color === 'success' ? 'Succès' : 'Erreur'}</AlertTitle>
           {message}
         </Alert>
       )}
       <Card title="Créer un Examen" style={{ width: '100%', maxWidth: '1200px', marginTop: '5px' }}>
         <p>Définissez les détails de votre examen et ajoutez des fichiers.</p>
         <Form onFinish={handleSubmit} layout="vertical">
           <Form.Item label="Titre de l'examen" required>
             <Input type="text" value={examTitle} onChange={handleTitleChange} required />
           </Form.Item>
           <Form.Item label="Description de l'examen" required>
             <TextArea value={examDescription} onChange={handleDescriptionChange} rows={4} required />
           </Form.Item>
           <Form.Item label="Ajouter des fichiers">
             <Upload fileList={files} onChange={handleFileChange} beforeUpload={() => false} multiple={false}>
               <Button icon={<UploadOutlined />} style={{ width: '100%' }} required>Sélectionner des fichiers</Button>
             </Upload>
           </Form.Item>
           <Form.Item>
             <Button 
               type="primary" 
               htmlType="submit" 
               style={{ width: '100%', height: '40px', fontSize: '16px', background: '#1976d2', border: 'none' }} 
               loading={loading}
             >
               {loading ? 'Envoi en cours...' : 'Créer l\'examen'}
             </Button>
           </Form.Item>
         </Form>
 
         <div style={{ width: '100%', maxWidth: '1200px', marginTop: '20px', textAlign: 'center' }}>
           <Card hoverable style={{ borderLeft: '5px solid #1976d2', borderRight: '5px solid #1976d2', marginBottom: '20px' }}>
             <Title level={4} style={{ textAlign: 'center' }}>Soyez Concis</Title>
             <p>Assurez-vous que le titre et la description de l'examen sont clairs et concis.</p>
           </Card>
           <Card hoverable style={{ borderLeft: '5px solid #1976d2', borderRight: '5px solid #1976d2', marginBottom: '20px' }}>
             <Title level={4} style={{ textAlign: 'center' }}>Ajoutez des Fichiers</Title>
             <p>Ajoutez tous les fichiers nécessaires pour l'examen, tels que des documents PDF ( Uniquement )</p>
           </Card>
           <Card hoverable style={{ borderLeft: '5px solid #1976d2', borderRight: '5px solid #1976d2', marginBottom: '20px' }}>
             <Title level={4} style={{ textAlign: 'center' }}>Vérifiez les Détails</Title>
             <p>Avant de soumettre, vérifiez que toutes les informations sont correctes et complètes.</p>
           </Card>
         </div>
 
         <div style={{ textAlign: 'center', marginTop: '10px' }}>
           <Link to="/" style={{ fontSize: '16px', textDecoration: 'none', color: '#1890ff' }}>
             ⇐ Retour à l'accueil
           </Link>
         </div>
       </Card>
     </div>
   );
 };
 
 export default CreateExam;