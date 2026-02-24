import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const StaffDashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [updateData, setUpdateData] = useState({ status: '', remark: '' });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/department');
            setComplaints(res.data);
        } catch (err) {
            console.error('Error fetching department complaints', err);
        }
    };

    const handleOpenDialog = (complaint) => {
        setSelectedComplaint(complaint);
        setUpdateData({ status: complaint.status, remark: '' });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedComplaint(null);
    };

    const handleUpdate = async () => {
        try {
            await api.put(`/complaints/${selectedComplaint._id}/status`, updateData);
            fetchComplaints();
            handleCloseDialog();
        } catch (err) {
            console.error('Error updating complaint', err);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Staff Dashboard - {user?.name}</Typography>
            <Typography variant="subtitle1" gutterBottom>Managing complaints for your department</Typography>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Student</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {complaints.map((complaint) => (
                            <TableRow key={complaint._id}>
                                <TableCell>{complaint.title}</TableCell>
                                <TableCell>{complaint.studentId?.name || 'N/A'}</TableCell>
                                <TableCell>{complaint.category}</TableCell>
                                <TableCell>
                                    <Chip label={complaint.status} color={
                                        complaint.status === 'resolved' ? 'success' :
                                            complaint.status === 'pending' ? 'warning' : 'primary'
                                    } />
                                </TableCell>
                                <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" size="small" onClick={() => handleOpenDialog(complaint)}>
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Update Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Update Complaint Status</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>Title: {selectedComplaint?.title}</Typography>
                        <Typography variant="body2" paragraph>{selectedComplaint?.description}</Typography>

                        <TextField
                            fullWidth
                            select
                            margin="normal"
                            label="Status"
                            value={updateData.status}
                            onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in-progress">In-Progress</MenuItem>
                            <MenuItem value="resolved">Resolved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Add Remark"
                            multiline
                            rows={3}
                            value={updateData.remark}
                            onChange={(e) => setUpdateData({ ...updateData, remark: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default StaffDashboard;
