// src/components/admin/AdminNavbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminNavbar = ({ onLogout }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#4a6fa5' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Study Buddy Admin
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/admin/dashboard"
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/admin/register-teacher"
          >
            Add Teacher
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/admin/register-student"
          >
            Add Student
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/admin/resources"
          >
            Resources
          </Button>
          <Button 
            color="inherit" 
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
