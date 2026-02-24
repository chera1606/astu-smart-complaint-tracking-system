import React, { useState, useContext } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar,
    IconButton, CssBaseline, Divider, Avatar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import StaffOverview from './StaffOverview';
import AssignedComplaints from './AssignedComplaints';

const DRAWER_WIDTH = 240;

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/staff' },
    { label: 'Assigned Complaints', icon: <AssignmentIcon />, path: '/staff/complaints' },
];

const StaffLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };

    const drawer = (
        <Box>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#1565c0', color: 'white', py: 3 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: '#42a5f5', mb: 1 }}>{user?.name?.charAt(0)}</Avatar>
                <Typography variant="subtitle2" fontWeight="bold">{user?.name}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Staff Member</Typography>
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem button key={item.label} component={Link} to={item.path}
                        selected={location.pathname === item.path}
                        sx={{ '&.Mui-selected': { bgcolor: '#e3f2fd', color: '#1976d2', '& .MuiListItemIcon-root': { color: '#1976d2' } }, '&:hover': { bgcolor: '#f5f5f5' }, borderRadius: 1, mx: 1, mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem button onClick={handleLogout} sx={{ '&:hover': { bgcolor: '#ffeaea' }, borderRadius: 1, mx: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1565c0' }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { md: 'none' } }} onClick={() => setMobileOpen(!mobileOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap fontWeight="bold">ASTU Complaint System</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Staff Portal</Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', mt: '64px' } }}>
                {drawer}
            </Drawer>
            <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
                {drawer}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
                <Routes>
                    <Route path="/" element={<StaffOverview />} />
                    <Route path="/complaints" element={<AssignedComplaints />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default StaffLayout;
