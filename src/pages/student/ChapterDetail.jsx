import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Tabs, Tab,
  Breadcrumbs, Link as MuiLink, Button, CircularProgress,
  Alert, Collapse, IconButton
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import StudentNavbar from '../../components/student/StudentNavbar';

const ChapterDetail = () => {
  const { subjectId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [summary, setSummary] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qbLoading, setQbLoading] = useState(false);
  const [error, setError] = useState('');
  const [qbError, setQbError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [textbookUrl, setTextbookUrl] = useState(null);
  const [textbookLoading, setTextbookLoading] = useState(true);
  const [textbookError, setTextbookError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const chapterRes = await axios.get(`/subjects/${subjectId}/chapters/${chapterId}`);
        setChapter(chapterRes.data.chapter);

        const summaryRes = await axios.get(`/subjects/${subjectId}/chapters/${chapterId}/summary`);
        setSummary(summaryRes.data.summary);
      } catch (err) {
        setError('Failed to load chapter details');
      } finally {
        setLoading(false);
      }
    };

    const fetchTextbookUrl = async () => {
      try {
        setTextbookLoading(true);
        const res = await axios.get(`/subjects/${subjectId}/chapters/${chapterId}/textbook`);
        setTextbookUrl(res.data.textbookUrl);
      } catch (err) {
        setTextbookError('Failed to load textbook');
      } finally {
        setTextbookLoading(false);
      }
    };

    fetchData();
    fetchTextbookUrl();
  }, [subjectId, chapterId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setQbLoading(true);
        setQbError('');
        const response = await axios.get(`/subjects/${subjectId}/chapters/${chapterId}/questions`);
        setQuestions(response.data.questions.questions || []);
      } catch (err) {
        setQbError('Failed to load question bank');
      } finally {
        setQbLoading(false);
      }
    };

    if (tabValue === 1) fetchQuestions(); // Index 1 is now "Question Bank"
  }, [tabValue, subjectId, chapterId]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleQuizClick = () => navigate(`/student/subjects/${subjectId}/chapters/${chapterId}/quiz`);
  const handleToggle = (idx) => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));

  const renderSummarySection = (title, content) => {
    if (!content) return null;
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        {Array.isArray(content) ? (
          <Box component="ul" sx={{ pl: 3, mb: 0 }}>
            {content.map((item, idx) => (
              <li key={idx}>
                <Typography variant="body1">{item}</Typography>
              </li>
            ))}
          </Box>
        ) : (
          <Typography variant="body1">{content}</Typography>
        )}
      </Box>
    );
  };

  const CollapsibleQuestion = ({ question, index }) => (
    <Paper elevation={1} sx={{ mb: 2, p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleToggle(index)}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
          Q{index + 1}: {question.question}
        </Typography>
        <IconButton size="small">
          {expanded[index] ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={!!expanded[index]} timeout="auto" unmountOnExit>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Answer:</strong> {question.answer}
        </Typography>
        {question.explanation && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            <strong>Explanation:</strong> {question.explanation}
          </Typography>
        )}
      </Collapse>
    </Paper>
  );

  return (
    <>
      <StudentNavbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/student/subjects" underline="hover" color="inherit">
            Subjects
          </MuiLink>
          <MuiLink
            component={Link}
            to={`/student/subjects/${subjectId}/chapters`}
            underline="hover"
            color="inherit"
          >
            Subject {subjectId}
          </MuiLink>
          <Typography color="text.primary">
            {chapter?.title || `Chapter ${chapterId}`}
          </Typography>
        </Breadcrumbs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">{chapter?.title}</Typography>
              <Button
                variant="contained"
                onClick={handleQuizClick}
                sx={{
                  backgroundColor: '#4caf50', // Vibrant green
                  color: 'white',
                  fontWeight: 600,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: '#388e3c', // Darker shade on hover
                    boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.25)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Take a Personalized Quiz
              </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Summary" />
                <Tab label="Question Bank" />
              </Tabs>
            </Box>

            {tabValue === 0 ? (
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Chapter Summary
                </Typography>
                {summary ? (
                  <>
                    {renderSummarySection('Introduction', summary.introduction)}
                    {renderSummarySection('Key Concepts', summary.keyConcepts)}
                    {renderSummarySection('Theories and Formulae', summary.theoriesAndFormulae)}
                    {renderSummarySection('Applications', summary.applications)}
                    {renderSummarySection('Key Takeaways', summary.keyTakeaways)}
                  </>
                ) : (
                  <Typography variant="body2">No summary available for this chapter.</Typography>
                )}
              </Paper>
            ) : tabValue === 1 ? (
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Question Bank
                </Typography>
                {qbLoading ? (
                  <CircularProgress />
                ) : qbError ? (
                  <Alert severity="error">{qbError}</Alert>
                ) : Array.isArray(questions) && questions.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {questions.map((q, idx) => (
                      <CollapsibleQuestion key={idx} question={q} index={idx} />
                    ))}
                  </Box>
                ) : (
                  <Typography>No questions available for this chapter.</Typography>
                )}
              </Paper>
            ) : null}

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              {textbookLoading ? (
                <CircularProgress />
              ) : textbookError ? (
                <Alert severity="error">{textbookError}</Alert>
              ) : textbookUrl ? (
                <Button
                  variant="outlined"
                  href={textbookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Textbook
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No textbook available for this chapter.
                </Typography>
              )}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default ChapterDetail;
