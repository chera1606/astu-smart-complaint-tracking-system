import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Button, Container, Typography, Grid, Card, CardContent, AppBar, Toolbar, Chip
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VerifiedIcon from '@mui/icons-material/Verified';
import LoginIcon from '@mui/icons-material/Login';
import SchoolIcon from '@mui/icons-material/School';
import { AuthContext } from '../context/AuthContext';

const features = [
    {
        icon: <ReportProblemIcon sx={{ fontSize: 40 }} />,
        title: 'Submit Complaints',
        desc: 'Easily report campus issues with detailed descriptions and supporting attachments.',
        color: '#ef5350',
    },
    {
        icon: <TrackChangesIcon sx={{ fontSize: 40 }} />,
        title: 'Track Your Issue',
        desc: 'Monitor your complaint status in real-time using a unique auto-generated Tracking ID.',
        color: '#42a5f5',
    },
    {
        icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
        title: 'AI Assistant',
        desc: 'Get instant support and guidance through our integrated AI-powered assistant.',
        color: '#66bb6a',
    },
    {
        icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
        title: 'Transparent Workflow',
        desc: 'Clear visibility from submission to resolution — every step is tracked and documented.',
        color: '#ffa726',
    },
];

const HomePage = () => {
    const { user } = useContext(AuthContext);

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'staff') return '/staff';
        return '/student';
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0d1117' }}>

            {/* ===== HEADER / NAVBAR ===== */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: 'rgba(13, 17, 23, 0.85)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <SchoolIcon sx={{ color: '#42a5f5', fontSize: 30 }} />
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" color="white" lineHeight={1.1}>
                                ASTU Smart Complaint System
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: { xs: 'none', sm: 'block' } }}>
                                Adama Science and Technology University
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        component={Link}
                        to={getDashboardLink()}
                        startIcon={<LoginIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
                            px: 3,
                            py: 1,
                            fontWeight: 'bold',
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: '0 4px 15px rgba(66, 165, 245, 0.4)',
                            '&:hover': { background: 'linear-gradient(135deg, #0d47a1, #1976d2)', boxShadow: '0 6px 20px rgba(66, 165, 245, 0.5)' }
                        }}
                    >
                        {user ? 'Go to Dashboard' : 'Login'}
                    </Button>
                </Toolbar>
            </AppBar>

            {/* ===== HERO SECTION ===== */}
            <Box
                sx={{
                    position: 'relative',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                {/* Background Image */}
                <Box
                    sx={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'url(/astu_campus.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed',
                        filter: 'brightness(0.35)',
                        transition: 'transform 0.5s ease',
                    }}
                />
                {/* Gradient overlay */}
                <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(13,17,23,0.5) 0%, rgba(13,17,23,0.3) 50%, rgba(13,17,23,0.9) 100%)',
                }} />

                {/* Hero Content */}
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', pt: 10 }}>
                    <Chip
                        label="✦ Official University Management System"
                        sx={{ mb: 3, bgcolor: 'rgba(66, 165, 245, 0.15)', color: '#90caf9', border: '1px solid rgba(66,165,245,0.3)', fontWeight: 'bold' }}
                    />
                    <Typography
                        variant="h2"
                        fontWeight={800}
                        color="white"
                        gutterBottom
                        sx={{
                            fontSize: { xs: '2rem', md: '3.5rem' },
                            lineHeight: 1.2,
                            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
                        }}
                    >
                        ASTU Smart Complaint &amp;
                        <Box component="span" sx={{ display: 'block', background: 'linear-gradient(90deg, #42a5f5, #66bb6a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Issue Tracking System
                        </Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'rgba(255,255,255,0.75)', mb: 5, maxWidth: 620, mx: 'auto', fontWeight: 400, lineHeight: 1.7 }}
                    >
                        A smart digital platform for reporting and tracking campus issues efficiently and transparently.
                    </Typography>
                    <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                        <Button
                            variant="contained"
                            component={Link}
                            to={getDashboardLink()}
                            startIcon={<LoginIcon />}
                            size="large"
                            sx={{
                                background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
                                px: 5, py: 1.8, fontWeight: 'bold', fontSize: '1rem',
                                borderRadius: 3, textTransform: 'none',
                                boxShadow: '0 6px 25px rgba(66, 165, 245, 0.5)',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(66, 165, 245, 0.7)' },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {user ? 'Go to Dashboard' : 'Login to Get Started'}
                        </Button>
                    </Box>
                    <Typography variant="caption" display="block" sx={{ mt: 3, color: 'rgba(255,255,255,0.4)' }}>
                        Access requires an account — contact your administrator to register
                    </Typography>
                </Container>

                {/* Floating scroll indicator */}
                <Box sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'rgba(255,255,255,0.4)', gap: 0.5, animation: 'bounce 2s infinite', '@keyframes bounce': { '0%, 100%': { transform: 'translateX(-50%) translateY(0)' }, '50%': { transform: 'translateX(-50%) translateY(-10px)' } } }}>
                    <Typography variant="caption">Scroll</Typography>
                    <Box sx={{ width: 1.5, height: 30, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />
                </Box>
            </Box>

            {/* ===== FEATURES SECTION ===== */}
            <Box sx={{ bgcolor: '#0d1117', py: 12 }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" mb={8}>
                        <Typography variant="overline" sx={{ color: '#42a5f5', fontWeight: 'bold', letterSpacing: 3 }}>CAPABILITIES</Typography>
                        <Typography variant="h3" fontWeight="bold" color="white" gutterBottom>Key Features</Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, mx: 'auto' }}>
                            Everything you need for efficient and transparent campus issue management
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {features.map((f, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        bgcolor: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 3,
                                        p: 1,
                                        textAlign: 'center',
                                        transition: 'all 0.4s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            borderColor: f.color,
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 12px 40px ${f.color}30`
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ color: f.color, mb: 2 }}>{f.icon}</Box>
                                        <Typography variant="h6" fontWeight="bold" color="white" gutterBottom>{f.title}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ===== FOOTER ===== */}
            <Box
                component="footer"
                sx={{
                    bgcolor: '#060a10',
                    color: 'rgba(255,255,255,0.5)',
                    py: 5,
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    mt: 'auto'
                }}
            >
                <Container>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                        <SchoolIcon sx={{ color: '#42a5f5', fontSize: 20 }} />
                        <Typography variant="subtitle2" color="white" fontWeight="bold">ASTU Smart Complaint System</Typography>
                    </Box>
                    <Typography variant="body2">
                        Adama Science and Technology University &bull; Building E2, Adama, Ethiopia
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.5 }}>
                        Version 1.0.0 &bull; &copy; {new Date().getFullYear()} ASTU. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;
