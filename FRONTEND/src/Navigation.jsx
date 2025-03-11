import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import {Navigate, useNavigate} from 'react-router-dom';
import { useState } from 'react';


function Navigation() {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuItems = ['Fonctionnalités', 'Comment ça marche', 'Témoignages', 'Contact'];

    return (
        <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <SchoolIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
                        SUNU SCHOOL AI
                    </Typography>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {menuItems.map((item) => (
                            <Button key={item} color="primary">{item}</Button>
                        ))}
                        <Button variant="contained" color="primary" onClick={() => navigate('/connexion')}>
                            Se Connecter
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => navigate('/inscription')}>
                            S'inscrire
                        </Button>
                    </Box>

                    {/* Mobile Menu */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            color="primary"
                            onClick={handleMenu}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            sx={{ mt: '45px' }}
                        >
                            {menuItems.map((item) => (
                                <MenuItem key={item} onClick={handleClose}>
                                    {item}
                                </MenuItem>
                            ))}
                            <MenuItem onClick={handleClose}>
                                <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/connexion')}>
                                    Se Connecter
                                </Button>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/inscription')}>
                                    S'inscrire
                                </Button>
                            </MenuItem>

                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navigation;