import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Alert, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Recuperation = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [color, setColor] = useState("info");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/authentification/reinitialisation", { email });

            if (response.status === 200) {
                localStorage.setItem("email", email);
                navigate("/mis-a-jour");
            }
        } catch (err){
            setMessage("Cet email ne figure pas dans la base");
            setColor("error");
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={6} sx={{ padding: 4, textAlign: 'center', width: '100%' }}>
                <Typography variant="h5" color="primary" fontWeight={600} gutterBottom>
                    Récupération de mot de passe
                </Typography>
                {message && <Alert severity={color} sx={{ mb: 2 }}>{message}</Alert>}
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Entrez votre email pour recevoir un lien de réinitialisation.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        type="email"
                        label="Votre email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        Envoyer
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Recuperation;