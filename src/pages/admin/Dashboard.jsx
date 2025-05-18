// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Box, Paper, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // These endpoints would need to be created in your backend
        const teachersRes = await axios.get('/admin/teachers');
        const studentsRes = await axios.get('/admin/students');
        
        setTeachers(teachersRes.data.teachers);
        setStudents(studentsRes.data.students);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
          Admin Dashboard
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Teachers" />
            <Tab label="Students" />
          </Tabs>
        </Box>
        
        {loading ? (
          <Typography>Loading data...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box>
            {activeTab === 0 ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Teacher List</Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/admin/register-teacher')}
                    sx={{ 
                      backgroundColor: '#4a6fa5',
                      '&:hover': {
                        backgroundColor: '#3d5d8a'
                      }
                    }}
                  >
                    Add New Teacher
                  </Button>
                </Box>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Subjects</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teachers.length > 0 ? (
                        teachers.map((teacher) => (
                          <TableRow key={teacher.id}>
                            <TableCell>{teacher.id}</TableCell>
                            <TableCell>{teacher.name}</TableCell>
                            <TableCell>{teacher.email}</TableCell>
                            <TableCell>{teacher.subjects?.join(', ') || 'None'}</TableCell>
                            <TableCell>
                              {teacher.is_online ? (
                                <span style={{ color: 'green' }}>Online</span>
                              ) : (
                                <span style={{ color: 'gray' }}>Offline</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No teachers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Student List</Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/admin/register-student')}
                    sx={{ 
                      backgroundColor: '#4a6fa5',
                      '&:hover': {
                        backgroundColor: '#3d5d8a'
                      }
                    }}
                  >
                    Add New Student
                  </Button>
                </Box>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Joined Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              {new Date(student.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No students found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
