import React from 'react'
import { Typography, TextField } from '@mui/material'
import { EssayQuestion } from '@/features/exam/type'

interface WritingSectionProps {
  currentQuestion: EssayQuestion
  answers: Record<string, string>
  handleAnswerChange: (questionId: string, answer: string) => void
}

const WritingSection: React.FC<WritingSectionProps> = ({
  currentQuestion,
  answers,
  handleAnswerChange,
}) => {
  return (
    <>
      <Typography variant="body2" gutterBottom>
        {currentQuestion.questionText}
      </Typography>
      <TextField
        multiline
        rows={6}
        fullWidth
        value={answers[currentQuestion.id] || ''}
        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
        placeholder="Write your answer here..."
      />
    </>
  )
}

export default WritingSection
