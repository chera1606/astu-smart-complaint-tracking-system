import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../utils/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try { const res = await api.get('/users'); setUsers(res.data); } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try { await api.delete(`/users/${id}`); fetchUsers(); } catch (e) { console.error(e); }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Manage Users</Typography>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                        <TableRow>
                            <TableCell><b>User ID</b></TableCell>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Email</b></TableCell>
                            <TableCell><b>Role</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(u => (
                            <TableRow key={u._id} hover>
                                <TableCell><Chip label={u.userId || 'N/A'} size="small" /></TableCell>
                                <TableCell>{u.name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    <Chip label={u.role} size="small" color={u.role === 'admin' ? 'error' : u.role === 'staff' ? 'warning' : 'primary'} />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Delete User">
                                        <IconButton color="error" size="small" onClick={() => handleDelete(u._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ManageUsers;
