import React from 'react'
import { Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { MultipleChoiceQuestion, Section } from '@/features/exam/type'

interface ReadingSectionProps {
  currentSection: Section
  currentQuestion: MultipleChoiceQuestion
  answers: Record<string, string>
  handleAnswerChange: (questionId: string, answer: string) => void
}

const ReadingSection: React.FC<ReadingSectionProps> = ({
  currentSection,
  currentQuestion,
  answers,
  handleAnswerChange,
}) => {
  return (
    <>
      <Typography variant="body1" gutterBottom>
        {currentSection.essayText}
      </Typography>
      <Typography variant="body2" sx={{ mt: 3 }}>
        {currentQuestion.questionText}
      </Typography>
      <RadioGroup
        value={answers[currentQuestion.id] || ''}
        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
      >
        {currentQuestion.options?.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    </>
  )
}

export default ReadingSection
