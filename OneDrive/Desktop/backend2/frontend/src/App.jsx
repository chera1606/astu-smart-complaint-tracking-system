import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

import HomePage from './pages/HomePage';
import Login from './pages/Login';

import AdminLayout from './pages/admin/AdminLayout';
import StudentLayout from './pages/student/StudentLayout';
import StaffLayout from './pages/staff/StaffLayout';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />

                {/* Admin Routes */}
                <Route path="/admin/*" element={
                    <PrivateRoute allowedRoles={['admin']}>
                        <AdminLayout />
                    </PrivateRoute>
                } />

                {/* Student Routes */}
                <Route path="/student/*" element={
                    <PrivateRoute allowedRoles={['student']}>
                        <StudentLayout />
                    </PrivateRoute>
                } />

                {/* Staff Routes */}
                <Route path="/staff/*" element={
                    <PrivateRoute allowedRoles={['staff']}>
                        <StaffLayout />
                    </PrivateRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
