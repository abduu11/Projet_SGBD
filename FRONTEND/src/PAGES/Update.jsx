import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box, Alert, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Update = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setNewConfirmPass] = useState("");
    const [message, setMessage] = useState("");
    const [color, setColor] = useState("info");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            if (confirmPass !== newPassword) {
                setMessage("Les mots de passe ne sont pas identiques");
                setColor("error");
            } else if (newPassword.length < 8){
                setMessage("Le mot de passe doit contenir au moins 8 caracteres");
                setColor("error");
            } else {
                const email = localStorage.getItem("email");
                const response = await axios.put("http://localhost:5000/api/authentification/mise-a-jour-mdp", { email, newPassword });
                if (response.status === 200) {
                    setMessage("Mot de passe mis a jour avec succes");
                    setColor("success");
                    setTimeout(() => {
                        navigate("/connexion");
                    },2000);
                }
            }
        } catch (err) {
            console.log(err);
            setMessage("Une erreur s'est produite.");
            setColor("error");
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={6} sx={{ padding: 4, textAlign: 'center', width: '100%' }}>
                <Typography variant="h5" color="primary" fontWeight={600} gutterBottom>
                    Changer de mot de passe
                </Typography>
                {message && <Alert severity={color} sx={{ mb: 2 }}>{message}</Alert>}
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Entrez le nouveau mot de passe.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        type="password"
                        label="Nouveau mot de passe"
                        variant="outlined"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Confirmer mot de passe"
                        variant="outlined"
                        value={confirmPass}
                        onChange={(e) => setNewConfirmPass(e.target.value)}
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

export default Update;