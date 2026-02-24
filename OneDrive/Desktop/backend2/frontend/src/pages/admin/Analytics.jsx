import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import api from '../../utils/api';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        api.get('/complaints/analytics').then(r => setAnalytics(r.data)).catch(console.error);
    }, []);

    if (!analytics) return <Typography>Loading analytics...</Typography>;

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Analytics</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Complaints by Category</Typography>
                        {analytics.byCategory?.map(c => (
                            <Box key={c._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Chip label={c._id} color="primary" size="small" />
                                <Typography fontWeight="bold">{c.count} complaints</Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Complaints by Department</Typography>
                        {analytics.byDepartment?.map(d => (
                            <Box key={d._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography>{d.departmentName}</Typography>
                                <Typography fontWeight="bold">{d.count} complaints</Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                        <Typography variant="h6">Resolution Rate</Typography>
                        <Typography variant="h2" color="success.main" fontWeight="bold">{analytics.resolutionRate}%</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
