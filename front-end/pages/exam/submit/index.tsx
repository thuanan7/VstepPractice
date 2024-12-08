import React, { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const ExamSubmit: React.FC = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const submitAnswers = async () => {
      try {
        // Simulate API calls
        const answerData = { answer: 'This is the answer to question 1' };
        const summaryData = { summary: 'Summary of the exam results' };
        const submit_answer = { progress: 'User has completed section 1' };
        const finish = { log: 'User started the exam at 10:00 AM' };

        // Simultaneous API calls using fetch
        const apiCall1 = fetch('http://localhost:3000/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answerData),
        });

        const apiCall2 = fetch('http://localhost:3000/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(summaryData),
        });

        const apiCall3 = fetch('http://localhost:3000/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progressData),
        });

        const apiCall4 = fetch('http://localhost:3000/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData),
        });

        // Run all API calls simultaneously
        await Promise.all([apiCall1, apiCall2, apiCall3, apiCall4]);

        // Navigate to result page after successful API calls
        navigate('/exam/1/result');
      } catch (err) {
        console.error('Error submitting answers:', err);
        setError('An error occurred while submitting your answers. Please try again.');
      }
    };
    submitAnswers();
  }, [navigate])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ width: '80%' }}>
          {error}
        </Alert>
      ) : (
        <>
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Submitting your answers...
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Please wait while we save your responses.
          </Typography>
        </>
      )}
    </Box>
  )
}

export default ExamSubmit
