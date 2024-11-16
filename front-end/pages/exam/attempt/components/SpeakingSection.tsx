import { Typography, Button } from '@mui/material'
import { SpeakingQuestion } from '@/features/exam/type'

interface SpeakingSectionProps {
  currentQuestion: SpeakingQuestion
}

const SpeakingSection: React.FC<SpeakingSectionProps> = ({
  currentQuestion,
}) => {
  return (
    <>
      <Typography variant="body2" gutterBottom>
        {currentQuestion.questionText}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {currentQuestion.speakingPrompt}
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Record Answer
      </Button>
    </>
  )
}

export default SpeakingSection
