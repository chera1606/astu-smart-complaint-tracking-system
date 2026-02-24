import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        departmentId: ''
    });

    useEffect(() => {
        fetchComplaints();
        fetchCategories();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/student');
            setComplaints(res.data);
        } catch (err) {
            console.error('Error fetching complaints', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/complaints', formData);
            fetchComplaints();
            setFormData({ title: '', description: '', category: '', departmentId: '' });
        } catch (err) {
            console.error('Error creating complaint', err);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Student Dashboard - Welcome {user?.name}</Typography>

            <Box elevation={3} component={Paper} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>File a New Complaint</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" label="Title" name="title" value={formData.title} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" select label="Category" name="category" value={formData.category} onChange={handleChange} required>
                        <MenuItem value="Hardware">Hardware</MenuItem>
                        <MenuItem value="Software">Software</MenuItem>
                        <MenuItem value="Network">Network</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField fullWidth margin="normal" select label="Department" name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                        {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                    </TextField>
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit Complaint</Button>
                </form>
            </Box>

            <Typography variant="h5" gutterBottom>My Complaints</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.map((complaint) => (
                            <TableRow key={complaint._id}>
                                <TableCell>{complaint.title}</TableCell>
                                <TableCell>{complaint.category}</TableCell>
                                <TableCell>{complaint.departmentId?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip label={complaint.status} color={
                                        complaint.status === 'resolved' ? 'success' :
                                            complaint.status === 'pending' ? 'warning' : 'primary'
                                    } />
                                </TableCell>
                                <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default StudentDashboard;
