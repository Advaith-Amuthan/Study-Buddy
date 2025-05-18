import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Button, CircularProgress, Alert,
  Paper, Typography, Radio, RadioGroup,
  FormControlLabel, FormControl, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Collapse, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const QuizInterface = () => {
  const { subjectId, chapterId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Quiz timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(
          `/ai/quiz/${subjectId}/${chapterId}/generate`,
          {},
          { withCredentials: true }
        );
        setQuiz(data.quiz);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [subjectId, chapterId]);

  const handleAnswerSelect = (questionIndex, value) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleNavigation = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(currentQuestion + 1, quiz.length - 1)
      : Math.max(currentQuestion - 1, 0);
    setCurrentQuestion(newIndex);
  };

  const handleQuizSubmit = async () => {
    setConfirmOpen(false);
    try {
      setLoading(true);
      const formattedAnswers = quiz.map((q, index) => ({
        ...q,
        studentAnswer: userAnswers[index] || 'unanswered'
      }));

      const { data } = await axios.post(
        `/ai/quiz/${subjectId}/${chapterId}/submit`,
        { answers: formattedAnswers },
        { withCredentials: true }
      );
      
      setResults(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        mt: 4,
        textAlign: 'center'
      }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom color="text.primary">
          Crafting Your Personalized Quiz
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyzing your learning history and generating optimal questions...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          This usually takes 10-20 seconds. Please don't close this page.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          Retry Quiz
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.history.back()}
        >
          Return to Chapter
        </Button>
      </Box>
    );
  }

  if (submitted && results) {
    return <QuizResults results={results} />;
  }

  const currentQ = quiz[currentQuestion];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <LinearProgress 
          variant="determinate" 
          value={(currentQuestion + 1) / quiz.length * 100}
          sx={{ height: 8, mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1">
            Question {currentQuestion + 1} of {quiz.length}
          </Typography>
          <Typography variant="subtitle1" color="primary">
            ⏳ {formatTime(timeLeft)} remaining
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }} elevation={3}>
        <Typography variant="h5" component="h2" gutterBottom>
          {currentQ.question}
        </Typography>

        {currentQ.type === 'mcq' ? (
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={userAnswers[currentQuestion] || ''}
              onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
            >
              {currentQ.options.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio color="primary" />}
                  label={option}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    p: 1,
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ) : (
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={userAnswers[currentQuestion] || ''}
              onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="True"
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                value="false"
                control={<Radio color="primary" />}
                label="False"
                sx={{ mb: 1 }}
              />
            </RadioGroup>
          </FormControl>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          disabled={currentQuestion === 0}
          onClick={() => handleNavigation('prev')}
          sx={{ width: 120 }}
        >
          ← Previous
        </Button>
        
        {currentQuestion === quiz.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmOpen(true)}
            sx={{ width: 120 }}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => handleNavigation('next')}
            sx={{ width: 120 }}
          >
            Next →
          </Button>
        )}
      </Box>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleQuizSubmit}
        timeSpent={formatTime(900 - timeLeft)}
        answeredCount={Object.keys(userAnswers).length}
        totalQuestions={quiz.length}
      />
    </Box>
  );
};

const QuizResults = ({ results }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExplanation = (index) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Quiz Results: {results.score}/{results.total}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {results.score === results.total ? 
            '🎉 Perfect Score! Well done!' : 
            'Review your mistakes below 👇'}
        </Typography>
      </Box>

      {results.wrongAnswers.map((item, index) => (
        <Paper 
          key={index} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3,
            borderLeft: `4px solid ${item.correctAnswer === item.studentAnswer ? '#4caf50' : '#f44336'}`
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              mb: expanded[index] ? 2 : 0
            }}
            onClick={() => toggleExplanation(index)}
          >
            {item.correctAnswer === item.studentAnswer ? (
              <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 30 }} />
            ) : (
              <CancelIcon color="error" sx={{ mr: 2, fontSize: 30 }} />
            )}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {item.question}
            </Typography>
            <IconButton>
              {expanded[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={expanded[index]}>
            <Box sx={{ pl: 6, pr: 2 }}>
              <Typography sx={{ mt: 2 }}>
                <strong>Your answer:</strong> 
                <span style={{ 
                  color: item.correctAnswer === item.studentAnswer ? '#4caf50' : '#f44336',
                  marginLeft: '8px'
                }}>
                  {item.studentAnswer || 'No answer provided'}
                </span>
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Correct answer:</strong> {item.correctAnswer}
              </Typography>
              <Typography sx={{ mt: 2, mb: 1 }}>
                <strong>Explanation:</strong>
              </Typography>
              <Typography 
                sx={{ 
                  fontStyle: 'italic',
                  backgroundColor: 'background.default',
                  p: 2,
                  borderRadius: 2
                }}
              >
                {item.explanation}
              </Typography>
            </Box>
          </Collapse>
        </Paper>
      ))}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          ↻ Retry Quiz
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => window.history.back()}
        >
          ← Back to Chapter
        </Button>
      </Box>
    </Box>
  );
};

const ConfirmationDialog = ({ open, onClose, onConfirm, timeSpent, answeredCount, totalQuestions }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle sx={{ bgcolor: 'background.paper' }}>
      Ready to Submit?
    </DialogTitle>
    <DialogContent sx={{ pt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
        <StatBox title="Time Spent" value={timeSpent} />
        <StatBox title="Questions Answered" value={`${answeredCount}/${totalQuestions}`} />
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
        You won't be able to change answers after submission. 
        Double-check your responses!
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 3 }}>
      <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
        Cancel
      </Button>
      <Button 
        onClick={onConfirm} 
        variant="contained" 
        color="primary"
        size="large"
      >
        🚀 Final Submission
      </Button>
    </DialogActions>
  </Dialog>
);

const StatBox = ({ title, value }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="h6" color="text.primary">
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Box>
);

export default QuizInterface;
