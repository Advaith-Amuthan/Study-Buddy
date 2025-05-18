// src/components/student/SessionSidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, CircularProgress,
  Alert, Chip, Link, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';

const SessionSidebar = () => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false); // Changed initial state
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjectsError, setSubjectsError] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState('');

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const response = await axios.get('/subjects');
        setSubjects(response.data.subjects);
      } catch (err) {
        setSubjectsError('Failed to load subjects');
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch sessions when selected subject changes
  useEffect(() => {
    const fetchSessions = async () => {
      if (!selectedSubject) {
        setLoading(false); // Clear loading if no subject selected
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/sessions/status', {
          params: { subjectId: selectedSubject },
          withCredentials: true
        });
        setSessions(response.data.sessions);
      } catch (err) {
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [selectedSubject]);

  const handleSessionRequest = async (e) => {
    e.preventDefault();
    setRequesting(true);
    setRequestError('');

    try {
      if (!selectedSubject) {
        throw new Error('Please select a subject');
      }

      const response = await axios.post(
        `/sessions/request/${selectedSubject}`,
        {},
        { withCredentials: true }
      );
      const newSession = response.data.session;
      if (newSession) {
        setSessions(prev => [...prev, newSession]);
      }
    } catch (err) {
      setRequestError(err.response?.data?.message || err.message || 'Request failed');
    } finally {
      setRequesting(false);
    }
  };

  const activeSession = sessions.find(s => s.status === 'active');
  const pendingSession = sessions.find(s => s.status === 'pending');

  return (
    <Box sx={{ flex: 1, ml: 2 }}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Subject</InputLabel>
          <Select
            value={selectedSubject}
            label="Select Subject"
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={subjectsLoading}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.title}
              </MenuItem>
            ))}
          </Select>
          {subjectsLoading && <CircularProgress size={24} />}
          {subjectsError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {subjectsError}
            </Typography>
          )}
        </FormControl>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : activeSession || pendingSession ? (
          <>
            <Typography variant="h6" gutterBottom>
              You already have a pending or active session
            </Typography>
            {/* ... existing session display ... */}
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Request Session
            </Typography>
            <form onSubmit={handleSessionRequest}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                You can request one session at a time. Sessions last 1 hour.
              </Typography>

              {requestError && (
                <Alert severity="error" sx={{ mb: 2 }}>{requestError}</Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={requesting || !selectedSubject}
                sx={{
                  backgroundColor: '#4a6fa5',
                  '&:hover': { backgroundColor: '#3d5d8a' }
                }}
              >
                {requesting ? <CircularProgress size={24} /> : 'Request Session'}
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SessionSidebar;
