import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/connexion");
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#1976D2" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Logo ou Nom de l'Application */}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Tableau de Bord {localStorage.getItem("role")}
                </Typography>

                {/* Bouton Déconnexion */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        backgroundColor: "white",
                        color: "#1976D2",
                        "&:hover": { backgroundColor: "#42A5F5" },
                    }}
                >
                    Déconnexion
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
