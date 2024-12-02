import React from 'react'
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { ReadingQuestions, Section } from '@/features/exam/type'

interface ReadingSectionProps {
  currentSection: Section
  currentPart: ReadingQuestions
  answers: Record<string, string>
  handleAnswerChange: (questionId: string, answer: string) => void
}

const ReadingSection: React.FC<ReadingSectionProps> = ({
  currentSection,
  currentPart,
  answers,
  handleAnswerChange,
}) => {
  return (
    <>
      <Typography variant="body1" gutterBottom>
        {currentSection.content}
      </Typography>
      {currentPart.questions.map((question) => (
        <Box key={question.id} sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            {question.questionText}
          </Typography>
          <RadioGroup
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            {question.options?.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}
    </>
  )
}

export default ReadingSection
