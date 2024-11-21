import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Paper } from '@mui/material'
import { VSTEPExamConfig } from './fake'
import AttemptTabs from '@/pages/exam/attempt/components/AttemptTabs'
import TableQuestion from '@/pages/exam/attempt/components/TableQuestion'
import SpeakingSection from '@/pages/exam/attempt/components/SpeakingSection'
import WritingSection from '@/pages/exam/attempt/components/WritingSection'
import ReadingSection from '@/pages/exam/attempt/components/ReadingSection'
import ListeningSection from '@/pages/exam/attempt/components/ListeningSection'
import { useNavigate } from 'react-router-dom'
import { SectionPartType } from '@/features/exam/configs'

const ExamPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const flatQuestions = VSTEPExamConfig.sections.flatMap(
    (section, sectionIndex) =>
      section.questions.map((question, questionIndex) => ({
        ...question,
        sectionIndex,
        questionIndex,
      })),
  )

  useEffect(() => {
    setCurrentSectionIndex(currentQuestion.sectionIndex)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [currentQuestionIndex])

  const currentQuestion = flatQuestions[currentQuestionIndex]
  const currentSection = VSTEPExamConfig.sections[currentQuestion.sectionIndex]
  const findFirstQuestionIndexOfSection = (sectionIndex: number) => {
    return flatQuestions.findIndex((q) => q.sectionIndex === sectionIndex)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < flatQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex)
    const firstQuestionIndex = findFirstQuestionIndexOfSection(sectionIndex)
    setCurrentQuestionIndex(firstQuestionIndex)
  }

  const handleQuestionClick = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex)
    setCurrentSectionIndex(flatQuestions[questionIndex].sectionIndex)
  }

  const handleSubmit = () => {
    navigate('/exam/1/submit')
  }

  return (
    <Grid container spacing={2} sx={{ height: '100vh', padding: 2 }}>
      <AttemptTabs
        tabs={VSTEPExamConfig.sections.map((x) => x.title)}
        active={currentSectionIndex}
        onChoose={handleSectionChange}
      />
      <Grid item xs={8} sx={{ position: 'relative' }}>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            paddingBottom: 10,
            overflowY: 'auto',
            height: 'calc(100vh - 100px)',
          }}
        >
          {currentSection.type === SectionPartType.listening &&
            currentQuestion.type === 'audio' && (
              <ListeningSection
                currentQuestion={currentQuestion}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
              />
            )}

          {currentSection.type === SectionPartType.reading &&
            currentQuestion.type === 'multiple-choice' && (
              <ReadingSection
                currentSection={currentSection}
                currentQuestion={currentQuestion}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
              />
            )}

          {currentSection.type === SectionPartType.writing &&
            currentQuestion.type === 'essay' && (
              <WritingSection
                currentQuestion={currentQuestion}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
              />
            )}

          {currentSection.type === SectionPartType.speaking &&
            currentQuestion.type === 'speaking' && (
              <SpeakingSection currentQuestion={currentQuestion} />
            )}
        </Paper>

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: '16%',
            right: '16%',
            backgroundColor: 'white',
            padding: 2,
            boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="outlined"
            disabled={currentQuestionIndex === 0}
            onClick={handlePreviousQuestion}
          >
            Previous Question
          </Button>
          {currentQuestionIndex === flatQuestions.length - 1 ? (
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit Exam
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNextQuestion}>
              Next Question
            </Button>
          )}
        </Box>
      </Grid>

      <TableQuestion
        data={flatQuestions.map((_, index) => index)}
        onChoose={handleQuestionClick}
        onAutoSubmit={handleSubmit}
        active={currentQuestionIndex}
      />
    </Grid>
  )
}

export default ExamPage
