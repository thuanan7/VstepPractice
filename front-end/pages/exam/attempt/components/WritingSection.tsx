import React from 'react'
import { Typography, TextField } from '@mui/material'
import { EssayQuestion } from '@/features/exam/type'

interface WritingSectionProps {
  currentPart: EssayQuestion
  answers: Record<string, string>
  handleAnswerChange: (questionId: string, answer: string) => void
}

const WritingSection: React.FC<WritingSectionProps> = ({
  currentPart,
  answers,
  handleAnswerChange,
}) => {
  const countWords = (string: string) => {
    console.log(string);
    // Trim whitespace and split by spaces or word boundaries
    if (string === undefined) {
      return 0;
    }
    const words = string.trim().split(/\s+/);
    return words.filter(word => word.length > 0).length;
  }

  return (
    <>
      <Typography 
        variant='body1' 
        gutterBottom
        dangerouslySetInnerHTML={{ __html: currentPart.instructions }}
      >
      </Typography>
      <Typography 
        variant="body2" 
        gutterBottom
        dangerouslySetInnerHTML={{ __html: currentPart.questionText }}
      >
      </Typography>
      <Typography 
        variant="body2" 
        align="right"
      >
        Words: {countWords(answers[currentPart.id])}
        <br />
        <br />
      </Typography>
      <TextField
        multiline
        rows={6}
        fullWidth
        value={answers[currentPart.id] || ''}
        onChange={(e) => handleAnswerChange(currentPart.id, e.target.value)}
        placeholder="Write your answer here..."
      />
    </>
  )
}

export default WritingSection
