import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import api from '../../utils/api';

const AIChatPage = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! I am the ASTU Smart Complaint Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userText = input;
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setInput('');
        setLoading(true);
        try {
            const res = await api.post('/query', { text: userText });
            setMessages(prev => [...prev, { sender: 'bot', text: res.data.message }]);
        } catch {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={700}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>AI Assistant</Typography>
            <Paper elevation={2} sx={{ p: 0, borderRadius: 2, overflow: 'hidden', height: '65vh', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, bgcolor: '#1565c0', color: 'white' }}>
                    <Typography variant="subtitle1" fontWeight="bold">ASTU Support Chatbot</Typography>
                </Box>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {messages.map((msg, i) => (
                        <Box key={i} sx={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            bgcolor: msg.sender === 'user' ? '#1976d2' : '#f5f5f5',
                            color: msg.sender === 'user' ? 'white' : 'text.primary',
                            p: 1.5, borderRadius: 2, maxWidth: '80%'
                        }}>
                            <Typography variant="body2">{msg.text}</Typography>
                        </Box>
                    ))}
                    {loading && <Typography variant="caption" color="text.secondary">Typing...</Typography>}
                </Box>
                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
                    <TextField fullWidth size="small" placeholder="Ask a question..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} />
                    <Button variant="contained" onClick={handleSend} disabled={loading}>Send</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AIChatPage;
