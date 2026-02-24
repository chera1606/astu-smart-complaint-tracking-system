import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, MenuItem, Alert } from '@mui/material';
import api from '../../utils/api';

const SubmitComplaint = () => {
    const [formData, setFormData] = useState({ title: '', description: '', category: '', departmentId: '', priority: 'Medium', location: '' });
    const [departments, setDepartments] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/categories').then(r => setDepartments(r.data)).catch(console.error);
    }, []);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSuccess(''); setError('');
        try {
            const res = await api.post('/complaints', formData);
            setSuccess(`Complaint submitted! Your Tracking ID: ${res.data.trackingId}`);
            setFormData({ title: '', description: '', category: '', departmentId: '', priority: 'Medium', location: '' });
        } catch (err) { setError(err.response?.data?.message || 'Submission failed'); }
    };

    return (
        <Box maxWidth={700}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Submit a Complaint</Typography>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" required label="Complaint Title" name="title" value={formData.title} onChange={handleChange} />
                    <TextField fullWidth margin="normal" required label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleChange} />
                    <TextField fullWidth margin="normal" required select label="Category" name="category" value={formData.category} onChange={handleChange}>
                        {['Hardware', 'Software', 'Network', 'Facilities', 'Other'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth margin="normal" required select label="Department" name="departmentId" value={formData.departmentId} onChange={handleChange}>
                        {departments.map(d => <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>)}
                    </TextField>
                    <TextField fullWidth margin="normal" required label="Location / Building" name="location" value={formData.location} onChange={handleChange} />
                    <TextField fullWidth margin="normal" required select label="Priority" name="priority" value={formData.priority} onChange={handleChange}>
                        {['Low', 'Medium', 'High', 'Critical'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </TextField>
                    <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 3, py: 1.5 }}>Submit Complaint</Button>
                </form>
            </Paper>
        </Box>
    );
};

export default SubmitComplaint;
