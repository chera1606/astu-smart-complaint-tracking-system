import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import api from '../../utils/api';

const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={2} sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `5px solid ${color}`, borderRadius: 2 }}>
        <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>{value ?? '...'}</Typography>
        </Box>
        <Box sx={{ color, opacity: 0.3, fontSize: 60 }}>{icon}</Box>
    </Paper>
);

const AdminOverview = () => {
    const [analytics, setAnalytics] = useState(null);
    const [userCount, setUserCount] = useState({ students: 0, staff: 0 });

    useEffect(() => {
        api.get('/complaints/analytics').then(r => setAnalytics(r.data)).catch(console.error);
        api.get('/users').then(r => {
            const students = r.data.filter(u => u.role === 'student').length;
            const staff = r.data.filter(u => u.role === 'staff').length;
            setUserCount({ students, staff });
        }).catch(console.error);
    }, []);

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Dashboard Overview</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Complaints" value={analytics?.totalComplaints} icon={<ReportIcon fontSize="inherit" />} color="#1976d2" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Pending" value={analytics?.pendingComplaints} icon={<HourglassEmptyIcon fontSize="inherit" />} color="#f57c00" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Resolved" value={analytics?.resolvedComplaints} icon={<CheckCircleIcon fontSize="inherit" />} color="#388e3c" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Total Students" value={userCount.students} icon={<PeopleIcon fontSize="inherit" />} color="#7b1fa2" />
                </Grid>
            </Grid>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Complaints by Category</Typography>
            {analytics?.byCategory?.map(c => (
                <Box key={c._id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Chip label={c._id} />
                    <Typography variant="body2">{c.count} complaints</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default AdminOverview;
