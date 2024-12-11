import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { attemptRequest } from '@/app/api'
import { useNavigate, useParams } from 'react-router-dom'
import { IAttemptExam } from '@/features/exam/type.ts'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
} from '@mui/material'

const AttemptStudent = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [examTest, setExamTest] = useState<IAttemptExam[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      toast.error('Invalid exam ID!')
      navigate('/exam')
      return
    }
    void getExamTest()
  }, [id, navigate])
  const getExamTest = async () => {
    try {
      setIsLoading(true)
      const response = await attemptRequest.getAttemptByExamId(id)
      if (!response) {
        toast.error('Invalid exam ID!')
        navigate('/exam')
        return
      } else {
        setExamTest(response)
      }
    } catch (error) {
      toast.error('Không tìm thấy đề thi')
      navigate('/exam')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Container
      sx={{
        margin: '0 auto',
        padding: 4,
      }}
    >
      {/* Tên bài thi */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {data.quizName}
      </Typography>

      {/* Mô tả */}
      <Typography variant="body1" color="textSecondary" gutterBottom>
        {data.description}
      </Typography>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Tổng quan các lần làm bài trước của bạn
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Làm lại</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Điểm</TableCell>
                <TableCell align="center">Xem lại</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.attempts.map((attempt) => (
                <TableRow key={attempt.attemptNumber}>
                  <TableCell align="center">{attempt.attemptNumber}</TableCell>
                  <TableCell align="center">{attempt.status}</TableCell>
                  <TableCell align="center">{attempt.score}</TableCell>
                  <TableCell align="center">
                    <Button variant="text">{attempt.reviewLink}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => console.log('Start Quiz clicked')}
        >
          {data.buttons.startQuiz}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => console.log('Start new bài test clicked')}
        >
          {data.buttons.startNewTest}
        </Button>
      </Box>
    </Container>
  )
}

export default AttemptStudent
const data = {
  quizName: 'VSTEP B2 Exams',
  description:
    'Bạn sắp bắt đầu bài kiểm tra VSTEP B2. Bài kiểm tra bao gồm các phần Reading, Writing, và Speaking. Thời gian làm bài là 120 phút.',
  attempts: [
    {
      attemptNumber: 1,
      status: 'Đã xong',
      submittedAt: 'Wednesday, 9 October 2024, 7:49 AM',
      score: '20,00 / 25,00',
      reviewLink: 'Xem lại',
    },
    {
      attemptNumber: 2,
      status: 'Đã xong',
      submittedAt: 'Wednesday, 30 October 2024, 8:47 AM',
      score: '23,00 / 25,00',
      reviewLink: 'Xem lại',
    },
    {
      attemptNumber: 3,
      status: 'Đã xong',
      submittedAt: 'Sunday, 10 November 2024, 12:40 PM',
      score: '25,00 / 25,00',
      reviewLink: 'Xem lại',
    },
  ],
  buttons: {
    startQuiz: 'Start Quiz',
    startNewTest: 'Start new bài test',
  },
}
