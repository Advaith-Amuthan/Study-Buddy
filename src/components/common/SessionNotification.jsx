import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import axios from 'axios';

const SessionNotification = () => {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const response = await axios.get('/sessions/status', {
          withCredentials: true
        });
        
        if (response.data.sessions) {
          // Find active sessions with meet links that we haven't notified about yet
          const activeSession = response.data.sessions.find(
            s => s.status === 'active' && s.meet_link && !localStorage.getItem(`notified-${s.id}`)
          );
          
          if (activeSession) {
            setSession(activeSession);
            setOpen(true);
            // Mark this session as notified
            localStorage.setItem(`notified-${activeSession.id}`, 'true');
          }
        }
      } catch (err) {
        console.error('Error checking for active sessions:', err);
      }
    };
    
    // Poll every 30 seconds
    const intervalId = setInterval(checkActiveSession, 30000);
    
    // Initial check
    checkActiveSession();
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleJoin = () => {
    if (session && session.meet_link) {
      window.open(session.meet_link, '_blank', 'noreferrer');
    }
    setOpen(false);
  };
  
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={60000}
    >
      <Alert 
        severity="success" 
        onClose={handleClose}
        sx={{ width: '100%' }}
        action={
          <Button color="inherit" size="small" onClick={handleJoin}>
            JOIN NOW
          </Button>
        }
      >
        Your {session?.subject_title} session is now active! Click to join the meeting.
      </Alert>
    </Snackbar>
  );
};

export default SessionNotification;
