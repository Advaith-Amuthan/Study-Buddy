import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Auth Pages
import Login from './pages/auth/Login';
import AdminLogin from './pages/admin/AdminLogin';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import RegisterTeacher from './pages/admin/RegisterTeacher';
import RegisterStudent from './pages/admin/RegisterStudent';
import ResourceUpload from './pages/admin/ResourceUpload';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';

// Student Pages
import Subjects from './pages/student/Subjects';
import Chapters from './pages/student/Chapters';
import ChapterDetail from './pages/student/ChapterDetail';
import Quiz from './pages/student/Quiz';

// Common Components
import SessionNotification from './components/common/SessionNotification';

// Theme
const theme = createTheme({
  palette: {
    primary: { main: '#4a6fa5' },
    secondary: { main: '#ffb347' },
    warning: { main: '#ffd166' },
    success: { main: '#7ec850' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
    text: { primary: '#333333', secondary: '#666666' },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

// Wrapper for using location.key as a key prop
function ChapterDetailWithKey() {
  const location = useLocation();
  return <ChapterDetail key={location.key} />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Session notification for students */}
        <SessionNotification />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/register-teacher" element={<RegisterTeacher />} />
          <Route path="/admin/register-student" element={<RegisterStudent />} />
          <Route path="/admin/resources" element={<ResourceUpload />} />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

          {/* Student Routes */}
          <Route path="/student/subjects" element={<Subjects />} />
          <Route path="/student/subjects/:subjectId/chapters" element={<Chapters />} />
          <Route
            path="/student/subjects/:subjectId/chapters/:chapterId"
            element={<ChapterDetailWithKey />}
          />
          <Route path="/student/subjects/:subjectId/chapters/:chapterId/quiz" element={<Quiz />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
