import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

interface AttemptTimerProps {
  minutes: number
  onTimeUp: () => void
}

const AttemptTimer: React.FC<AttemptTimerProps> = ({ minutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  // Bộ đếm ngược
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp() // Gọi hàm khi hết thời gian
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer) // Dọn dẹp interval khi component unmount
  }, [timeLeft, onTimeUp])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: 1,
        borderRadius: 2,
        backgroundColor: '#f0f4f8',
        color: '#333',
      }}
    >
      <AccessTimeIcon color="primary" />
      <Typography variant="h6">{formatTime(timeLeft)}</Typography>
    </Box>
  )
}

export default AttemptTimer
