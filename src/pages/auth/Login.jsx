// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Paper, Typography, Box, Tabs, Tab } from '@mui/material';

const Login = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = activeTab === 0 
        ? '/auth/student/login' 
        : '/auth/teacher/login';
      
      await axios.post(endpoint, { email, password });
      
      // Redirect based on role
      if (activeTab === 0) {
        navigate('/student/subjects');
      } else {
        navigate('/teacher/dashboard');
      }
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
          Study Buddy
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          sx={{ mb: 3 }}
        >
          <Tab label="Student" />
          <Tab label="Teacher" />
        </Tabs>
        
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
            <a href="/admin/login" style={{ color: '#4a6fa5', textDecoration: 'none' }}>
              Admin Login
            </a>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
