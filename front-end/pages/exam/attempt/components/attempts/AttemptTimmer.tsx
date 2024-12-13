import React, { useEffect, useState } from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

interface AttemptTimerProps {
  minutes: number
  onTimeUp: () => void
}

const AttemptTimer: React.FC<AttemptTimerProps> = ({ minutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60)
  const totalTime = minutes * 60

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        borderRadius: 2,
        backgroundColor: '#f0f4f8',
        color: '#333',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon color="primary" />
        <Typography
          color={'text.secondary'}
          sx={{ fontSize: '16px', fontWeight: 'bold' }}
        >
          {formatTime(timeLeft)}
        </Typography>
      </Box>
    </Box>
  )
}

export default AttemptTimer
