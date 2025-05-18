// src/components/teacher/TeacherNavbar.jsx
import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  IconButton, Drawer, List, ListItem, ListItemText,
  ListItemIcon, Divider, useMediaQuery, useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

const TeacherNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/auth/teacher/logout');
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Study Buddy</Typography>
        <Typography variant="subtitle2" color="text.secondary">Teacher Portal</Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/teacher/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#4a6fa5' }}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Study Buddy
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" component={Link} to="/teacher/dashboard" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                Study Buddy Teacher
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/teacher/dashboard"
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default TeacherNavbar;
