// src/pages/teacher/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, FormControl, 
  InputLabel, Select, MenuItem, Button, CircularProgress,
  Alert, Card, CardContent, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeacherNavbar from '../../components/teacher/TeacherNavbar';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [nextSession, setNextSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionError, setSessionError] = useState('');
  const [acceptingSession, setAcceptingSession] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [meetLink, setMeetLink] = useState('');
  const navigate = useNavigate();

  // Fetch teacher subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/sessions/subjects', {
          withCredentials: true
        });
        
        if (response.data.success && response.data.subjects.length > 0) {
          setSubjects(response.data.subjects);
          
          // Always select the first subject as default
          setSelectedSubject(response.data.subjects[0].id);
        } else {
          throw new Error(response.data.message || 'Failed to load subjects');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);

  // Fetch next session when subject is selected
  useEffect(() => {
    const fetchNextSession = async () => {
      if (!selectedSubject) return;
      
      try {
        setSessionLoading(true);
        setSessionError('');
        const response = await axios.get(`/sessions/next/${selectedSubject}`, {
          withCredentials: true
        });
        
        setNextSession(response.data.session);
        if (response.data.session?.meet_link) {
          setMeetLink(response.data.session.meet_link);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // No pending sessions is not an error
          setNextSession(null);
        } else {
          setSessionError(err.response?.data?.message || err.message || 'Failed to load session');
        }
      } finally {
        setSessionLoading(false);
      }
    };
    
    fetchNextSession();
  }, [selectedSubject]);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setMeetLink('');
  };

  const handleAcceptSession = async () => {
    if (!nextSession) return;
    
    try {
      setAcceptingSession(true);
      const response = await axios.put(`/sessions/${nextSession.id}/accept`, {}, {
        withCredentials: true
      });
      
      setMeetLink(response.data.session.meet_link);
      
      // Open Google Meet in new tab
      if (response.data.session.meet_link) {
        window.open(response.data.session.meet_link, '_blank', 'noreferrer');
      }
      
      // Update session with meet link
      setNextSession({
        ...nextSession,
        status: 'active',
        meet_link: response.data.session.meet_link
      });
    } catch (err) {
      setSessionError(err.response?.data?.message || err.message || 'Failed to accept session');
    } finally {
      setAcceptingSession(false);
    }
  };

  const handleEndSession = async () => {
    if (!nextSession) return;
    
    try {
      setEndingSession(true);
      await axios.put(`/sessions/${nextSession.id}/end`, {}, {
        withCredentials: true
      });
      
      // Clear session data
      setNextSession(null);
      setMeetLink('');
    } catch (err) {
      setSessionError(err.response?.data?.message || err.message || 'Failed to end session');
    } finally {
      setEndingSession(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get the currently selected subject name
  const getSelectedSubjectName = () => {
    const subject = subjects.find(sub => sub.id === selectedSubject);
    return subject ? subject.title : '';
  };

  return (
    <>
      <TeacherNavbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4, textAlign: 'center' }}>
          Teacher Dashboard
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Session Management
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="subject-select-label">Subject</InputLabel>
                <Select
                  labelId="subject-select-label"
                  id="subject-select"
                  value={selectedSubject}
                  label="Subject"
                  onChange={handleSubjectChange}
                  disabled={loading || subjects.length === 0}
                  renderValue={() => getSelectedSubjectName()}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {selectedSubject && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  
                  {sessionLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : sessionError ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {sessionError}
                    </Alert>
                  ) : nextSession ? (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {nextSession.status === 'pending' ? 'Pending Session' : 'Active Session'}
                      </Typography>
                      
                      <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, mb: 3 }}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Session ID:</strong> {nextSession.id}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Status:</strong> {nextSession.status.charAt(0).toUpperCase() + nextSession.status.slice(1)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Requested:</strong> {formatDate(nextSession.requested_at)}
                        </Typography>
                        {meetLink && (
                          <Typography variant="body1" gutterBottom>
                            <strong>Meet Link:</strong>{' '}
                            <a href={meetLink} target="_blank" rel="noreferrer">
                              {meetLink}
                            </a>
                          </Typography>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<VideocamIcon />}
                          onClick={handleAcceptSession}
                          disabled={acceptingSession || nextSession.status !== 'pending' || !!meetLink}
                          sx={{ minWidth: '45%' }}
                        >
                          {acceptingSession ? 'Accepting...' : 'Accept Session'}
                        </Button>
                        
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<StopIcon />}
                          onClick={handleEndSession}
                          disabled={endingSession || nextSession.status !== 'active' || !meetLink}
                          sx={{ minWidth: '45%' }}
                        >
                          {endingSession ? 'Ending...' : 'End Session'}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      No pending sessions for this subject. Check back later.
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
