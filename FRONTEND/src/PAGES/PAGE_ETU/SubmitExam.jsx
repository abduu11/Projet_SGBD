import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Select, MenuItem, Button, TextField, Box, FormControl, InputLabel, Paper, Alert } from '@mui/material';

const SubmitExam = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchExams = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token non trouvé");
                return;
            }
            try {
                const res = await axios.get("http://localhost:5000/api/exams/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Examens récupérés:", res.data);
                setExams(res.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des examens:", err);
            }
        };

        fetchExams();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedExam || !file) {
            setMessage("Veuillez sélectionner un examen et un fichier.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_examen", selectedExam);
        formData.append("id_etudiant", localStorage.getItem('id_utilisateur'));

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token non trouvé");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/submissions/submit", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "multipart/form-data"
                }
            });
            console.log("Sujet soumis avec succès:", res.data);
            setMessage("Sujet soumis avec succès.");
        } catch (err) {
            console.error("Erreur lors de la soumission du sujet:", err);
            setMessage("Erreur lors de la soumission du sujet.");
        }
    };

    return (
        <Box mb={8} style={{ display: 'flex', justifyContent: 'center' }}>
            <Container maxWidth="lg" style={{ marginBottom: '50px' }}>
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '20px' }}>
                    <Typography variant="h4" gutterBottom>
                        Soumettre un examen
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="select-exam-label">Sélectionner un examen</InputLabel>
                            <Select
                                labelId="select-exam-label"
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                label="Sélectionner un examen"
                            >
                                <MenuItem value="">
                                    <em>Aucun</em>
                                </MenuItem>
                                {exams.map((exam) => (
                                    <MenuItem key={exam.id} value={exam.id}>{exam.titre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Soumettre
                            </Button>
                        </Box>
                    </form>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                </Paper>
            </Container>
        </Box>
    );
};

export default SubmitExam;
