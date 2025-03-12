import { Grid, Card, CardContent, Typography, Box, Button, Container, Avatar, Rating, IconButton, useTheme, useMediaQuery } from '@mui/material';
import {motion} from 'framer-motion';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Navigation from './Navigation';
import { useState } from 'react';

const features = [

    {
        icon: <AssignmentIcon fontSize="large" />,
        title: "Gestion des Examens",
        description: "Créez et organisez vos examens en ligne avec une interface intuitive et professionnelle."
    },
    {
        icon: <AutoFixHighIcon fontSize="large" />,
        title: "Correction IA",
        description: "Notre technologie d'IA avancée assure une correction rapide et objective de tous les types d'examens."
    },
    {
        icon: <BarChartIcon fontSize="large" />,
        title: "Analyses Détaillées",
        description: "Visualisez les performances et suivez la progression avec des tableaux de bord intelligents."
    },
    {
        icon: <TimelineIcon fontSize="large" />,
        title: "Suivi en Temps Réel",
        description: "Surveillez la progression des étudiants et identifiez les domaines d'amélioration instantanément."
    },
    {
        icon: <SecurityIcon fontSize="large" />,
        title: "Sécurité Maximale",
        description: "Protection des données et confidentialité assurées pour tous les examens et résultats."
    },
    {
        icon: <SupportIcon fontSize="large" />,
        title: "Support 24/7",
        description: "Une équipe dédiée pour vous accompagner à chaque étape de votre expérience."
    }
];

const testimonials = [

    {
        name: "Prof. Amadou Diop",
        role: "Université de Dakar",
        comment: "SUNU SCHOOL AI a révolutionné ma façon d'évaluer mes étudiants. La correction automatique me fait gagner un temps précieux.",
        rating: 5
    },
    {
        name: "Fatou Sow",
        role: "Lycée d'Excellence",
        comment: "Une plateforme intuitive qui simplifie considérablement la gestion des examens. Le support technique est excellent.",
        rating: 5
    },
    {
        name: "Dr. Moussa Kane",
        role: "École Supérieure Polytechnique",
        comment: "Les analyses détaillées nous permettent de mieux comprendre les performances de nos étudiants et d'adapter notre enseignement.",
        rating: 5
    }

];

const steps = [
    {
        number: "01",
        title: "Inscription",
        description: "Créez votre compte en quelques clics"
    },
    {
        number: "02",
        title: "Configuration",
        description: "Paramétrez votre espace selon vos besoins"
    },
    {
        number: "03",
        title: "Création",
        description: "Créez vos premiers examens"
    },
    {
        number: "04",
        title: "Lancement",
        description: "Déployez vos examens en toute simplicité"
    }
];

const footerLinks = {
    produit: [
        { name: "Fonctionnalités", href: "#" },
        { name: "Démo", href: "#demo" },
        { name: "Guide d'utilisation", href: "#" }


    ],
    entreprise: [
        { name: "À propos", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Carrières", href: "#" },
        { name: "Contact", href: "#" }
    ],
    legal: [
        { name: "Conditions d'utilisation", href: "#" },
        { name: "Politique de confidentialité", href: "#" },
        { name: "Mentions légales", href: "#" }
    ],
    support: [
        { name: "Centre d'aide", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Statut du service", href: "#" }
    ]
};

function FeatureCard({ icon, title, description }) {
    return (
        <Card sx={{ height: '100%', bgcolor: 'background.paper', borderRadius: 4 }}>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 2 }}>
                    <Box sx={{
                        bgcolor: 'primary.light',
                        p: 2,
                        borderRadius: '100%',
                        color: '#fff'
                    }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" component="h3" color="primary.main" textAlign="center">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        {description}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

function TestimonialCard({ name, role, comment, rating }) {
    return (
        <Card sx={{ height: '100%', p: { xs: 2, md: 3 }, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccountCircleIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h6">{name}</Typography>
                        <Typography variant="body2" color="text.secondary">{role}</Typography>
                    </Box>
                </Box>
                <Rating value={rating} readOnly />
                <Typography variant="body1" color="text.secondary">"{comment}"</Typography>
            </Box>
        </Card>
    );
}

function TestimonialSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <Box sx={{ position: 'relative', px: { xs: 2, md: 4 } }}>
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
            >
                <TestimonialCard {...testimonials[currentIndex]} />
            </motion.div>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <IconButton onClick={prevTestimonial} color="primary">
                    <ArrowBackIcon />
                </IconButton>
                <IconButton onClick={nextTestimonial} color="primary">
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                py: 6,
                mt: 8,
                borderTop: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" color="primary.main" sx={{ mb: 2, fontWeight: 'bold' }}>
                                SUNU SCHOOL AI
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Révolutionnez l'évaluation scolaire grâce à l'intelligence artificielle. Notre plateforme simplifie la gestion des examens pour les établissements d'enseignement.
                            </Typography>
                        </Box>
                    </Grid>
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <Grid item xs={6} sm={3} md={2} key={category}>
                            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 2, fontWeight: 'bold', textTransform: 'capitalize' }}>
                                {category}
                            </Typography>
                            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                                {links.map((link) => (
                                    <Box component="li" key={link.name} sx={{ mb: 1 }}>
                                        <Button
                                            href={link.href}
                                            sx={{
                                                color: 'text.secondary',
                                                textTransform: 'none',
                                                justifyContent: 'flex-start',
                                                p: 0,
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    background: 'none'
                                                }
                                            }}
                                        >
                                            {link.name}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} SUNU_SCHOOL_AI. Tous droits réservés.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

function Hero() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (


        <Box
            sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                color: 'white',
                py: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden',
                height: '100vh',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center" sx={{paddingBottom: '60px'}} >
                    <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: { xs: 'center', md: 'left' , paddingTop: '100px'} }}>
                            <Typography variant="h2" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
                                SUNU SCHOOL AI
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 4 }}>
                                La révolution de l'évaluation scolaire par l'intelligence artificielle
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                <Button variant="contained" color="secondary" size="large">
                                    Commencer maintenant
                                </Button>
                                <Button variant="outlined" color="inherit" size="large">
                                    Voir la démo
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    {!isMobile && (
                        <Grid item xs={12} md={6} >
                            <Box component="img"
                                 src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                 sx={{ width: '100%', maxWidth: 600, display: 'block', mx: 'auto', borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40% ' ,paddingTop: '50px' }}
                            />
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}

function Acceuil() {
    return (
        <>
            <Navigation />

            <Box sx={{ bgcolor: '#f8f9fa'}}>

            <Hero />

            <Container maxWidth="lg" id="fonctionnalites">
                <Box sx={{ py: { xs: 6, md: 8 } }}>
                    <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: { xs: 4, md: 6 } }}>
                        Nos Fonctionnalités
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <FeatureCard {...feature} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper', borderRadius: 4, mb: { xs: 6, md: 8 } }}>
                    <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: { xs: 4, md: 6 } }}>
                        Comment ça marche
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {steps.map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Typography variant="h2" color="primary.main" sx={{ mb: 2, opacity: 0.5 }}>
                                        {step.number}
                                    </Typography>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {step.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Section Témoignages */}
                <Box sx={{ py: { xs: 6, md: 8 } }}>
                    <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: { xs: 4, md: 6 } }}>
                        Ce que disent nos utilisateurs
                    </Typography>
                    <TestimonialSlider />
                </Box>

                {/* Section CTA */}
                <Box sx={{ py: { xs: 6, md: 8 }, textAlign: 'center' }}>
                    <Card sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                    }}>
                        <Typography variant="h4" sx={{ mb: 3 }}>
                            Prêt à révolutionner vos évaluations ?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            Rejoignez les milliers d'établissements qui font confiance à SUNU SCHOOL AI
                        </Typography>
                        <Button variant="contained" color="secondary" size="large">
                            Commencer gratuitement
                        </Button>
                    </Card>
                </Box>
            </Container>
            <Footer />
        </Box>
        </>
    );
}

export default Acceuil;