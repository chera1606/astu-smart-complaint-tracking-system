import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, Button, Alert } from '@mui/material';
import api from '../../utils/api';

const ManageDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => { fetchDepts(); }, []);

    const fetchDepts = async () => {
        try { const res = await api.get('/categories'); setDepartments(res.data); } catch (e) { console.error(e); }
    };

    const handleCreate = async (e) => {
        e.preventDefault(); setSuccess(''); setError('');
        try {
            const res = await api.post('/categories', { name });
            setSuccess(`Department "${res.data.name}" created! ID: ${res.data.categoryId}`);
            setName(''); fetchDepts();
        } catch (err) { setError(err.response?.data?.message || 'Failed to create department'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this department?')) return;
        try { await api.delete(`/categories/${id}`); fetchDepts(); } catch (e) { console.error(e); }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Manage Departments</Typography>
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8 }}>
                    <TextField fullWidth size="small" label="New Department Name" value={name} onChange={e => setName(e.target.value)} required />
                    <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>Add Department</Button>
                </form>
            </Paper>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell><b>Dept ID</b></TableCell>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map(d => (
                            <TableRow key={d._id} hover>
                                <TableCell><Chip label={d.categoryId || 'N/A'} size="small" /></TableCell>
                                <TableCell>{d.name}</TableCell>
                                <TableCell>
                                    <Button size="small" color="error" onClick={() => handleDelete(d._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ManageDepartments;
