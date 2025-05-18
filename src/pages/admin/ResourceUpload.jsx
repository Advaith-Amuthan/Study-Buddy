// src/pages/admin/ResourceUpload.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, TextField,
  Button, FormControl, InputLabel, Select, MenuItem,
  Divider, Snackbar, Alert, Grid
} from '@mui/material';
import axios from 'axios';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { useNavigate } from 'react-router-dom';

const ResourceUpload = () => {
  // Subject form state
  const [subjectTitle, setSubjectTitle] = useState('');
  const [subjects, setSubjects] = useState([]);

  // Chapter form state
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [textbookUrl, setTextbookUrl] = useState('');
  const [questionBankUrl, setQuestionBankUrl] = useState('');
  const [summary, setSummary] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/admin/subs');
        setSubjects(response.data.subjects || []);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
        setError('Failed to load subjects. Please try again.');
      }
    };

    fetchSubjects();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/admin/subjects', {
        title: subjectTitle
      });

      setSubjects([...subjects, response.data.subject]);
      setSuccess('Subject added successfully!');
      setSubjectTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`/admin/subjects/${selectedSubject}/chapters`, {
        title: chapterTitle,
        textbook_url: textbookUrl,
        question_bank_url: questionBankUrl,
        summary
      });

      setSuccess('Chapter added successfully!');
      // Reset chapter form
      setChapterTitle('');
      setTextbookUrl('');
      setQuestionBankUrl('');
      setSummary('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add chapter. Please try again.');
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Resource Management
        </Typography>

        <Grid container spacing={4}>
          {/* Add Subject Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Add New Subject
              </Typography>

              <form onSubmit={handleAddSubject}>
                <TextField
                  label="Subject Title"
                  fullWidth
                  margin="normal"
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: '#4a6fa5',
                    '&:hover': {
                      backgroundColor: '#3d5d8a'
                    }
                  }}
                >
                  {loading ? 'Adding...' : 'Add Subject'}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Add Chapter Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Add New Chapter
              </Typography>

              <form onSubmit={handleAddChapter}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Select Subject</InputLabel>
                  <Select
                    value={selectedSubject}
                    label="Select Subject"
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Chapter Title"
                  fullWidth
                  margin="normal"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  required
                />

                <TextField
                  label="Textbook URL"
                  fullWidth
                  margin="normal"
                  value={textbookUrl}
                  onChange={(e) => setTextbookUrl(e.target.value)}
                  required
                  helperText="Enter a valid URL to the textbook PDF"
                />

                <TextField
                  label="Question Bank URL"
                  fullWidth
                  margin="normal"
                  value={questionBankUrl}
                  onChange={(e) => setQuestionBankUrl(e.target.value)}
                  required
                  helperText="Enter a valid URL to the question bank PDF"
                />

                <TextField
                  label="Chapter Summary"
                  fullWidth
                  margin="normal"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                  multiline
                  rows={4}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !selectedSubject}
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: '#4a6fa5',
                    '&:hover': {
                      backgroundColor: '#3d5d8a'
                    }
                  }}
                >
                  {loading ? 'Adding...' : 'Add Chapter'}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {error && (
          <Box sx={{ mt: 2 }}>
            <Typography color="error">
              {error}
            </Typography>
          </Box>
        )}

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default ResourceUpload;
