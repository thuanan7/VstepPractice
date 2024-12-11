import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Container,
  Chip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface Exam {
  id: string
  title: string
  description: string
  date: string
  status: 'upcoming' | 'ongoing' | 'completed'
}

const examList: Exam[] = [
  {
    id: '1',
    title: 'VSTEP B2 - Exam 1',
    description: 'Test your English proficiency for level B2.',
    date: '2024-11-20',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'VSTEP B2 - Exam 2',
    description: 'Improve your English skills with this test.',
    date: '2024-11-18',
    status: 'ongoing',
  },
  {
    id: '3',
    title: 'VSTEP B2 - Exam 3',
    description: 'Check your readiness for English proficiency.',
    date: '2024-11-10',
    status: 'completed',
  },
]

const ExamList: React.FC = () => {
  const navigate = useNavigate()

  const handleStartExam = (id: string) => {
    navigate(`/exam/${id}/attempt`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'info'
      case 'ongoing':
        return 'success'
      case 'completed':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          {examList.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam.id}>
              <Card variant="outlined">
                <CardHeader
                  title={exam.title}
                  subheader={exam.date}
                  action={
                    <Chip
                      label={exam.status}
                      color={getStatusColor(exam.status)}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {exam.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {exam.status === 'upcoming' || exam.status === 'ongoing' ? (
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={() => handleStartExam(exam.id)}
                    >
                      Start Exam
                    </Button>
                  ) : (
                    <Button size="small" color="secondary" disabled>
                      Completed
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default ExamList
