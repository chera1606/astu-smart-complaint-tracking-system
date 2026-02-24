import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import api from '../utils/api';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchAnalytics();
        fetchComplaints();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/complaints/analytics');
            setAnalytics(res.data);
        } catch (err) {
            console.error('Error fetching analytics', err);
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/all');
            setComplaints(res.data);
        } catch (err) {
            console.error('Error fetching recent complaints', err);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

            {analytics && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                            <Typography variant="h6">Total Complaints</Typography>
                            <Typography variant="h3" color="primary">{analytics.totalComplaints}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0' }}>
                            <Typography variant="h6">Pending</Typography>
                            <Typography variant="h3" color="warning.main">{analytics.pendingComplaints}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                            <Typography variant="h6">Resolution Rate</Typography>
                            <Typography variant="h3" color="success.main">{analytics.resolutionRate}%</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <Typography variant="h5" gutterBottom>All Complaints</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Student</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.map((complaint) => (
                            <TableRow key={complaint._id}>
                                <TableCell>{complaint.title}</TableCell>
                                <TableCell>{complaint.studentId?.name || 'Unknown'}</TableCell>
                                <TableCell>{complaint.departmentId?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip label={complaint.status} size="small" color={
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

export default AdminDashboard;
