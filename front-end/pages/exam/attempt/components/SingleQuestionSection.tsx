import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { IAttemptQuestion } from '@/features/exam/type'
interface SingleQuestionSectionProps {
  questions: IAttemptQuestion[]
}
const SingleQuestionSection = (props: SingleQuestionSectionProps) => {
  const { questions } = props
  return questions.map((question, index) => (
    <Box
      key={index}
      sx={{
        marginBottom: 3,
        padding: 2,
        borderRadius: '8px',
        backgroundColor: '#E3F2FD',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Câu hỏi {index + 1}
        </Typography>
      </Box>
      <Typography
        sx={{
          whiteSpace: 'pre-wrap',
          marginBottom: 1,
          color: '#37474F',
        }}
      >
        {question.questionText}
      </Typography>

      <FormControl component="fieldset">
        <RadioGroup value={question.options}>
          {question.options.map((option, optionIndex) => (
            <FormControlLabel
              key={optionIndex}
              value={optionIndex}
              control={<Radio />}
              label={option.content}
              sx={{
                color: '#000000',
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  ))
}
export default SingleQuestionSection
