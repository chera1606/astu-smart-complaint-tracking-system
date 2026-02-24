import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Box, Typography, TextField, Button, Alert, Paper, MenuItem } from '@mui/material';
import api from '../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        departmentId: ''
    });
    const [categories, setCategories] = useState([]);
    const { register, error } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await register(formData);
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'staff') navigate('/staff');
            else navigate('/student');
        } catch (err) {
            console.error("Registration failed", err);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Sign up
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            select
                            name="role"
                            label="Role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </TextField>

                        {formData.role === 'staff' && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                select
                                name="departmentId"
                                label="Department"
                                value={formData.departmentId}
                                onChange={handleChange}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
                            Sign Up
                        </Button>
                        <Box textAlign="center">
                            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                {"Already have an account? Sign In"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;
