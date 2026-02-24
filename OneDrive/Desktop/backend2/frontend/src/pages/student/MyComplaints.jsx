import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import api from '../../utils/api';

const statusColor = (s) => ({ resolved: 'success', pending: 'warning', 'in-progress': 'primary', rejected: 'error' }[s] || 'default');
const priorityColor = (p) => ({ Critical: 'error', High: 'warning', Medium: 'default', Low: 'success' }[p] || 'default');

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try { const res = await api.get('/complaints/student'); setComplaints(res.data); } catch (e) { console.error(e); }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>My Complaints</Typography>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell><b>Tracking ID</b></TableCell>
                            <TableCell><b>Title</b></TableCell>
                            <TableCell><b>Category</b></TableCell>
                            <TableCell><b>Priority</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Date</b></TableCell>
                            <TableCell><b>Details</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.map(c => (
                            <TableRow key={c._id} hover>
                                <TableCell><Chip label={c.trackingId || 'N/A'} size="small" color="info" /></TableCell>
                                <TableCell>{c.title}</TableCell>
                                <TableCell>{c.category}</TableCell>
                                <TableCell><Chip label={c.priority || 'Medium'} size="small" color={priorityColor(c.priority)} /></TableCell>
                                <TableCell><Chip label={c.status} size="small" color={statusColor(c.status)} /></TableCell>
                                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button size="small" variant="outlined" onClick={() => setSelected(c)}>View Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Details Dialog */}
            <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
                <DialogTitle>Complaint Details — {selected?.trackingId}</DialogTitle>
                <DialogContent>
                    <Typography><b>Title:</b> {selected?.title}</Typography>
                    <Typography sx={{ mt: 1 }}><b>Description:</b> {selected?.description}</Typography>
                    <Typography sx={{ mt: 1 }}><b>Location:</b> {selected?.location}</Typography>
                    <Typography sx={{ mt: 1 }}><b>Status:</b> {selected?.status}</Typography>
                    <Typography sx={{ mt: 1 }}><b>Priority:</b> {selected?.priority}</Typography>
                    {selected?.remarks?.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography fontWeight="bold">Staff Remarks:</Typography>
                            {selected.remarks.map((r, i) => (
                                <Box key={i} sx={{ mt: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                    <Typography variant="body2">{r.message}</Typography>
                                    <Typography variant="caption" color="text.secondary">{new Date(r.createdAt).toLocaleDateString()}</Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions><Button onClick={() => setSelected(null)}>Close</Button></DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyComplaints;
