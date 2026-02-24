import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import api from '../utils/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! I am the ASTU Smart Complaint Assistant. How can I help you today?' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: 'You: ' + input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/query', { text: input });
            setMessages(prev => [...prev, { sender: 'bot', text: 'Assistant: ' + res.data.message }]);
        } catch (err) {
            console.error('Chat error', err);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Assistant: Sorry, I am having trouble connecting right now.' }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <IconButton
                color="primary"
                onClick={() => setIsOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    backgroundColor: '#1976d2',
                    color: 'white',
                    '&:hover': { backgroundColor: '#115293' }
                }}
            >
                <ChatIcon fontSize="large" />
            </IconButton>
        );
    }

    return (
        <Paper
            elevation={4}
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 350,
                height: 450,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                zIndex: 1000
            }}
        >
            <Box sx={{ p: 2, bgcolor: '#1976d2', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Support Assistant</Typography>
                <IconButton size="small" sx={{ color: 'white' }} onClick={() => setIsOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {messages.map((msg, i) => (
                    <Box key={i} sx={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        bgcolor: msg.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                        p: 1.5,
                        borderRadius: 2,
                        maxWidth: '85%'
                    }}>
                        <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                ))}
                {loading && <Typography variant="caption" color="textSecondary">Assistant is typing...</Typography>}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Ask something..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button variant="contained" onClick={handleSend} disabled={loading}>Send</Button>
            </Box>
        </Paper>
    );
};

export default Chatbot;
