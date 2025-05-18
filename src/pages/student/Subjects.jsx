import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentNavbar from '../../components/student/StudentNavbar';
import SessionSidebar from '../../components/student/SessionSidebar';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/subjects');
        setSubjects(response.data.subjects);
      } catch (err) {
        setError('Failed to load subjects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectClick = (subjectId) => {
    navigate(`/student/subjects/${subjectId}/chapters`);
  };

  return (
    <>
      <StudentNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Subjects
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left 2/3: Subjects Table */}
          <Box sx={{ flex: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject Name</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <TableRow
                          key={subject.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleSubjectClick(subject.id)}
                        >
                          <TableCell>{subject.title}</TableCell>
                          <TableCell>
                            <Typography color="primary" sx={{ textDecoration: 'underline' }}>
                              View Chapters
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          No subjects available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          {/* Right 1/3: Session Sidebar */}
          <Box sx={{ flex: 1 }}>
            <SessionSidebar />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Subjects;
