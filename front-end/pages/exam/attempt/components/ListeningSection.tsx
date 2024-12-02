import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import { AudioQuestion } from '@/features/exam/type'

interface ListeningSectionProps {
  currentPart: AudioQuestion
  answers: Record<string, string>
  handleAnswerChange: (questionId: string, answer: string) => void
}

const ListeningSection: React.FC<ListeningSectionProps> = ({
  currentPart,
  answers,
  handleAnswerChange,
}) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Audio Question
      </Typography>
      <audio
        controls
        src="../../../../../public/Con Mua Ngang Qua (Part.2).mp3"
        style={{ width: '100%', marginBottom: 16 }}
      />
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

export default ListeningSection
