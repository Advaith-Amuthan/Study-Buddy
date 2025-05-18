// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Paper, Typography, Box } from '@mui/material';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/admin/login', { email, password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#4a6fa5' }}>
          Admin Login
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom sx={{ mb: 3 }}>
          Study Buddy Platform
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              backgroundColor: '#4a6fa5',
              '&:hover': {
                backgroundColor: '#3d5d8a'
              }
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <a href="/" style={{ color: '#4a6fa5', textDecoration: 'none' }}>
              Back to main login
            </a>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
