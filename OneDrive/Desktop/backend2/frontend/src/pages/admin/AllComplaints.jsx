import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, MenuItem } from '@mui/material';
import api from '../../utils/api';

const AllComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => { fetchComplaints(); }, [statusFilter]);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/all', { params: { status: statusFilter || undefined } });
            setComplaints(res.data);
        } catch (e) { console.error(e); }
    };

    const statusColor = (s) => {
        if (s === 'resolved') return 'success';
        if (s === 'pending') return 'warning';
        if (s === 'in-progress') return 'primary';
        return 'default';
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>All Complaints</Typography>
            <TextField select size="small" label="Filter by Status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ mb: 2, minWidth: 180 }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In-Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell><b>Tracking ID</b></TableCell>
                            <TableCell><b>Title</b></TableCell>
                            <TableCell><b>Student</b></TableCell>
                            <TableCell><b>Department</b></TableCell>
                            <TableCell><b>Priority</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Date</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.map(c => (
                            <TableRow key={c._id} hover>
                                <TableCell><Chip label={c.trackingId || 'N/A'} size="small" color="info" /></TableCell>
                                <TableCell>{c.title}</TableCell>
                                <TableCell>{c.studentId?.name || 'Unknown'}</TableCell>
                                <TableCell>{c.departmentId?.name || 'N/A'}</TableCell>
                                <TableCell><Chip label={c.priority || 'Medium'} size="small" color={c.priority === 'Critical' ? 'error' : c.priority === 'High' ? 'warning' : 'default'} /></TableCell>
                                <TableCell><Chip label={c.status} size="small" color={statusColor(c.status)} /></TableCell>
                                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AllComplaints;
