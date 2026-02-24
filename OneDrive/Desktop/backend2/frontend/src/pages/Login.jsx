import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'staff') navigate('/staff');
            else navigate('/student');
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f4f8' }}>
            <Container component="main" maxWidth="xs">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom sx={{ mb: 0 }}>
                        ASTU Complaint System
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Sign in to continue</Typography>
                    <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} />
                            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>Sign In</Button>
                        </Box>
                        <Typography variant="body2" textAlign="center" color="text.secondary">
                            Contact your administrator for an account.
                        </Typography>
                    </Paper>
                    <Button variant="text" component={Link} to="/" sx={{ mt: 2 }}>← Back to Home</Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;
