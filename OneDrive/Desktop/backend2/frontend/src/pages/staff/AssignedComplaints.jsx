import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import api from '../../utils/api';

const statusColor = (s) => ({ resolved: 'success', pending: 'warning', 'in-progress': 'primary', rejected: 'error' }[s] || 'default');
const priorityColor = (p) => ({ Critical: 'error', High: 'warning', Medium: 'default', Low: 'success' }[p] || 'default');

const AssignedComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updateData, setUpdateData] = useState({ status: '', remark: '' });

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try { const res = await api.get('/complaints/department'); setComplaints(res.data); } catch (e) { console.error(e); }
    };

    const handleOpen = (c) => {
        setSelected(c);
        setUpdateData({ status: c.status, remark: '' });
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/complaints/${selected._id}/status`, updateData);
            setSelected(null);
            fetchComplaints();
        } catch (e) { console.error(e); }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Assigned Complaints</Typography>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell><b>Tracking ID</b></TableCell>
                            <TableCell><b>Title</b></TableCell>
                            <TableCell><b>Student</b></TableCell>
                            <TableCell><b>Category</b></TableCell>
                            <TableCell><b>Priority</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Action</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.map(c => (
                            <TableRow key={c._id} hover>
                                <TableCell><Chip label={c.trackingId || 'N/A'} size="small" color="info" /></TableCell>
                                <TableCell>{c.title}</TableCell>
                                <TableCell>{c.studentId?.name || 'Unknown'}</TableCell>
                                <TableCell>{c.category}</TableCell>
                                <TableCell><Chip label={c.priority || 'Medium'} size="small" color={priorityColor(c.priority)} /></TableCell>
                                <TableCell><Chip label={c.status} size="small" color={statusColor(c.status)} /></TableCell>
                                <TableCell>
                                    <Button size="small" variant="outlined" onClick={() => handleOpen(c)}>Update</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
                <DialogTitle>Update Complaint - {selected?.trackingId}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>{selected?.description}</Typography>
                    <TextField fullWidth select margin="normal" label="Update Status" value={updateData.status} onChange={e => setUpdateData(p => ({ ...p, status: e.target.value }))}>
                        <MenuItem value="pending">Open / Pending</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </TextField>
                    <TextField fullWidth margin="normal" label="Add Remark" multiline rows={3} value={updateData.remark} onChange={e => setUpdateData(p => ({ ...p, remark: e.target.value }))} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelected(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AssignedComplaints;
