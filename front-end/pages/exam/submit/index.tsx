import React, { useEffect } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const ExamSubmit: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/exam/1/result')
    }, 3000)

    return () => clearTimeout(timeout)
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
      <CircularProgress size={60} color="primary" />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Submitting your answers...
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        Please wait while we save your responses.
      </Typography>
    </Box>
  )
}

export default ExamSubmit
