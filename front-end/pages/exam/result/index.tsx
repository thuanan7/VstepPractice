import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Chip,
  Container,
} from '@mui/material'
import { mockResult } from './fake'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useNavigate } from 'react-router-dom'

interface ExamResult {
  overallScore: number
  sectionScores: {
    listening: number
    reading: number
    writing: number
    speaking: number
  }
  answers: {
    id: string
    questionText: string
    correctAnswer: string
    studentAnswer: string
    isCorrect: boolean
  }[]
}

const ExamResult = () => {
  const navigate = useNavigate()
  const { overallScore, sectionScores, answers }: ExamResult = mockResult

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 4, maxWidth: 1000, margin: '0 auto' }}>
        <Typography
          variant="h4"
          color="primary"
          textAlign="center"
          gutterBottom
        >
          Exam Result
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ mb: 4 }}>
          Overall Score:{' '}
          <Chip
            label={overallScore}
            color={overallScore >= 50 ? 'success' : 'error'}
            sx={{ fontSize: 18, fontWeight: 'bold' }}
          />
        </Typography>
        <Paper elevation={3} sx={{ padding: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Section Scores
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography>Listening: {sectionScores.listening}/25</Typography>
            <Typography>Reading: {sectionScores.reading}/25</Typography>
            <Typography>Writing: {sectionScores.writing}/25</Typography>
            <Typography>Speaking: {sectionScores.speaking}/25</Typography>
          </Box>
        </Paper>

        <Typography variant="h5" color="textPrimary" gutterBottom>
          Answer Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Correct Answer</TableCell>
                <TableCell>Student Answer</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {answers.map((answer, index) => (
                <TableRow key={answer.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{answer.questionText}</TableCell>
                  <TableCell>{answer.correctAnswer}</TableCell>
                  <TableCell>{answer.studentAnswer}</TableCell>
                  <TableCell>
                    {answer.isCorrect ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4 }} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/exam')}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default ExamResult
