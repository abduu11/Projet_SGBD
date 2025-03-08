import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Download as DownloadIcon, Sort as SortIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const ExamList = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');
    const [visibleExams, setVisibleExams] = useState(6);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchExams = async () => {
          const token = localStorage.getItem('token'); 
            if (!token) {
                console.error("Token non trouvé");
                setLoading(false);
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
                setLoading(false);
            } catch (err) {
                console.error("Erreur lors de la récupération des examens:", err);
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const handleSort = () => {
        const sortedExams = [...exams].sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.date_creation) - new Date(b.date_creation);
            } else {
                return new Date(b.date_creation) - new Date(a.date_creation);
            }
        });
        setExams(sortedExams);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleShowMore = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Liste des sujets d'examens
            </Typography>
            <IconButton onClick={handleSort}>
                <SortIcon />
            </IconButton>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Grid container spacing={3}>
                        {exams.slice(0, visibleExams).map((exam) => (
                            <Grid item xs={12} sm={6} md={4} key={exam.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {exam.titre}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {new Date(exam.date_creation).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            href={`http://localhost:5000/uploads/${exam.filePath.split('/').pop()}`}
                                            target="_blank"
                                            startIcon={<DownloadIcon />}
                                        >
                                            Télécharger
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    {visibleExams < exams.length && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShowMore}
                            startIcon={<ExpandMoreIcon />}
                            style={{ marginTop: '20px' }}
                        >
                            Afficher plus
                        </Button>
                    )}
                    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                        <DialogTitle>Liste complète des sujets d'examens</DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                {exams.map((exam) => (
                                    <Grid item xs={12} sm={6} md={4} key={exam.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">
                                                    {exam.titre}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {new Date(exam.date_creation).toLocaleDateString()}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    href={`http://localhost:5000/uploads/${exam.filePath.split('/').pop()}`}
                                                    target="_blank"
                                                    startIcon={<DownloadIcon />}
                                                >
                                                    Télécharger
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Fermer
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    );
};

export default ExamList;
