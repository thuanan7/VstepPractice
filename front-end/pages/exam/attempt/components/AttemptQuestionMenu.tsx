import React, { useState } from 'react'
import { Box, Typography, Button, Divider } from '@mui/material'

// Dữ liệu mẫu
const mockParts = [
  {
    id: 1,
    title: 'Part 1',
    questions: [
      { id: 1, status: 'completed' },
      { id: 2, status: 'completed' },
      { id: 3, status: 'incomplete' },
      { id: 4, status: 'not-started' },
    ],
  },
  {
    id: 2,
    title: 'Part 2',
    questions: [
      { id: 5, status: 'incomplete' },
      { id: 6, status: 'completed' },
      { id: 7, status: 'not-started' },
      { id: 8, status: 'completed' },
    ],
  },
]

const QuestionNavigation = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)

  const handleQuestionClick = (questionId: number) => {
    setSelectedQuestion(questionId)
    console.log(`Question ${questionId} selected`)
  }

  return (
    <Box
      sx={{
        padding: 2,
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography
        sx={{ marginBottom: 2, fontWeight: 'bold', color: 'text.secondary' }}
      >
        Bảng câu hỏi
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      {mockParts.map((part) => (
        <Box key={part.id} sx={{ marginBottom: 3 }}>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ marginBottom: 1 }}
          >
            {part.title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1, // Khoảng cách giữa các nút
            }}
          >
            {part.questions.map((question) => (
              <Button
                key={question.id}
                variant="contained"
                size="small"
                onClick={() => handleQuestionClick(question.id)}
                sx={{
                  backgroundColor:
                    question.status === 'completed'
                      ? '#4caf50'
                      : question.status === 'incomplete'
                        ? '#f44336'
                        : '#9e9e9e', // Màu cho "not-started"
                  color: '#fff',
                  '&:hover': {
                    backgroundColor:
                      question.status === 'completed'
                        ? '#388e3c'
                        : question.status === 'incomplete'
                          ? '#d32f2f'
                          : '#757575', // Hover cho "not-started"
                  },
                  borderRadius: '4px',
                  minWidth: '40px',
                  textAlign: 'center',
                }}
              >
                {question.id}
              </Button>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default QuestionNavigation
