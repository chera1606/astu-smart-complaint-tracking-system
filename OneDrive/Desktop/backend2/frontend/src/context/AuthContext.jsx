import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                }
            } catch (err) {
                console.error("Login check failed", err);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const res = await api.post('/auth/register', userData);
            localStorage.setItem('token', res.data.token);
            setUser(res.data);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
