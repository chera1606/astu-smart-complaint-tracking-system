import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, Alert } from '@mui/material';
import api from '../../utils/api';

const RegisterUser = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', departmentId: '' });
    const [departments, setDepartments] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/categories').then(r => setDepartments(r.data)).catch(console.error);
    }, []);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(''); setError('');
        try {
            const res = await api.post('/auth/register', formData);
            setSuccess(`User "${res.data.name}" created successfully! User ID: ${res.data.userId}`);
            setFormData({ name: '', email: '', password: '', role: 'student', departmentId: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <Box maxWidth={600}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Register New User</Typography>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField margin="normal" fullWidth required label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                    <TextField margin="normal" fullWidth required label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <TextField margin="normal" fullWidth required label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                    <TextField margin="normal" fullWidth required select label="Role" name="role" value={formData.role} onChange={handleChange}>
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    {formData.role === 'staff' && (
                        <TextField margin="normal" fullWidth required select label="Department" name="departmentId" value={formData.departmentId} onChange={handleChange}>
                            {departments.map(d => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
                        </TextField>
                    )}
                    <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 3, py: 1.5 }}>Create User</Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegisterUser;
