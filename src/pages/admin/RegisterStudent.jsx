// src/pages/admin/RegisterStudent.jsx
import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, TextField, 
  Button, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useNavigate } from 'react-router-dom';

const RegisterStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/admin/register-student', {
        name,
        email,
        password
      });
      
      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/admin/logout');
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
      <AdminNavbar onLogout={handleLogout} />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Register New Student
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
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
              helperText="Password must be at least 6 characters"
            />
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{ 
                  backgroundColor: '#4a6fa5',
                  '&:hover': {
                    backgroundColor: '#3d5d8a'
                  }
                }}
              >
                {loading ? 'Registering...' : 'Register Student'}
              </Button>
            </Box>
          </form>
        </Paper>
        
        <Snackbar 
          open={success} 
          autoHideDuration={6000} 
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Student registered successfully!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default RegisterStudent;
