import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Breadcrumbs, Link as MuiLink, CircularProgress
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import StudentNavbar from '../../components/student/StudentNavbar';
import SessionSidebar from '../../components/student/SessionSidebar';

const Chapters = () => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const chaptersRes = await axios.get(`/subjects/${subjectId}/chapters`);
        setChapters(chaptersRes.data.chapters);
      } catch (err) {
        setError('Failed to load chapters');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  const handleChapterClick = (chapterId) => {
    navigate(`/student/subjects/${subjectId}/chapters/${chapterId}`);
  };

  return (
    <>
      <StudentNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/student/subjects" underline="hover" color="inherit">
            Subjects
          </MuiLink>
          <Typography color="text.primary">
            {subject?.title || `Subject ${subjectId}`}
          </Typography>
        </Breadcrumbs>
        <Typography variant="h4" gutterBottom>
          Chapters
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left 2/3: Chapters Table */}
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
                      <TableCell>Chapter Title</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chapters.length > 0 ? (
                      chapters.map((chapter) => (
                        <TableRow
                          key={chapter.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleChapterClick(chapter.id)}
                        >
                          <TableCell>{chapter.title}</TableCell>
                          <TableCell>
                            <Typography color="primary" sx={{ textDecoration: 'underline' }}>
                              View Details
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          No chapters available for this subject.
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

export default Chapters;
