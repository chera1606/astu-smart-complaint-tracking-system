import React, { useEffect, useState, useContext } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const StaffOverview = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ total: 0, inProgress: 0, resolved: 0 });

    useEffect(() => {
        api.get('/complaints/department').then(r => {
            const all = r.data;
            setStats({
                total: all.length,
                inProgress: all.filter(c => c.status === 'in-progress').length,
                resolved: all.filter(c => c.status === 'resolved').length,
            });
        }).catch(console.error);
    }, []);

    const cards = [
        { label: 'Total Assigned', value: stats.total, icon: <AssignmentIcon fontSize="inherit" />, color: '#1976d2' },
        { label: 'In Progress', value: stats.inProgress, icon: <SyncIcon fontSize="inherit" />, color: '#7b1fa2' },
        { label: 'Resolved', value: stats.resolved, icon: <CheckCircleIcon fontSize="inherit" />, color: '#388e3c' },
    ];

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Staff Dashboard — Welcome, {user?.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Overview of complaints assigned to your department.</Typography>
            <Grid container spacing={3}>
                {cards.map(c => (
                    <Grid item xs={12} sm={4} key={c.label}>
                        <Paper elevation={2} sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `5px solid ${c.color}`, borderRadius: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">{c.label}</Typography>
                                <Typography variant="h4" fontWeight="bold" color={c.color}>{c.value}</Typography>
                            </Box>
                            <Box sx={{ color: c.color, opacity: 0.25, fontSize: 60 }}>{c.icon}</Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StaffOverview;
