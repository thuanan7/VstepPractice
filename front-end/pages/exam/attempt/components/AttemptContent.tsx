import { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SingleQuestionSection from './SingleQuestionSection'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  selectPartBySectionAndPartId,
  selectPartsBySectionId,
} from '@/features/exam/attemptSelector'
import { SectionType } from '@/features/exam/type.ts'
import TextQuestionSection from './TextQuestionSection'
import SpeakingQuestionSection from './SpeakingQuestionSection'
import ListeningSection from './ListeningSection'
import ReadingSection from './ReadingSection'

const QuestionList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const sectionId = Number(searchParams.get('sectionId'))
  const partId = searchParams.get('partId')
    ? Number(searchParams.get('partId'))
    : null
  const { part, sectionType } = useSelector(
    selectPartBySectionAndPartId(sectionId, partId),
  )
  const sections = useSelector(selectPartsBySectionId(`${sectionId}`))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sectionId) {
      setLoading(true)
    } else if (sectionId && !partId && !part) {
      setSearchParams({
        sectionId: String(sectionId),
        partId: String(sections[0].id),
      })
    } else {
      setLoading(false)
    }
  }, [sectionId, partId, part, setSearchParams])

  const [isSingleQuestion, isTextQuestion, isSpeakingQuestion] = useMemo(() => {
    let single = false
    let text = false

    let speaking = false
    if (part && part.questions && part.questions.length > 0) {
      if (
        sectionType === SectionType.Reading ||
        sectionType === SectionType.Listening
      ) {
        single = true
      } else if (sectionType === SectionType.Writing) {
        text = true
      } else if (sectionType === SectionType.Speaking) {
        speaking = true
      }
    }
    return [single, text, speaking]
  }, [part, sectionType])
  const handleNext = () => {
    // if (currentQuestionIndex < mockQuestions.length - 1) {
    //   setCurrentQuestionIndex(currentQuestionIndex + 1)
    // }
  }

  const handlePrevious = () => {
    // if (currentQuestionIndex > 0) {
    //   setCurrentQuestionIndex(currentQuestionIndex - 1)
    // }
  }
  if (loading) return <Box>Loading...</Box>
  if (!part) return <Box>Không tìm thấy bài thi</Box>
  return (
    <>
      <Box
        sx={{
          height: 'calc(80vh - 50px)',
          overflowY: 'auto',
          padding: 2,
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#FAFAFA',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ marginBottom: 2 }}>
          <Typography
            sx={{
              marginBottom: 2,
              fontWeight: 'bold',
              color: 'text.secondary',
            }}
          >
            {part.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#616161',
              whiteSpace: 'pre-wrap',
            }}
          >
            {part.instructions}
          </Typography>
        </Box>
        <Box
          sx={{
            marginBottom: 3,
            padding: 2,
            backgroundColor: '#E3F2FD',
            borderRadius: '8px',
          }}
        >
          {sectionType === SectionType.Listening && (
            <ListeningSection part={part} />
          )}
          {(sectionType === SectionType.Reading ||
            sectionType === SectionType.Writing ||
            sectionType === SectionType.Speaking) && (
            <ReadingSection part={part} />
          )}
        </Box>
        {isSingleQuestion && (
          <SingleQuestionSection questions={part.questions} />
        )}
        {isTextQuestion && <TextQuestionSection questions={part.questions} />}
        {isSpeakingQuestion && (
          <SpeakingQuestionSection questions={part.questions} />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 2,
          padding: 1,
          borderRadius: '8px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevious}
          // disabled={currentQuestionIndex === 0}
          startIcon={<ArrowBackIcon />}
          sx={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            // opacity: currentQuestionIndex === 0 ? 0.6 : 1, // Hiệu ứng khi disabled
          }}
        >
          Trở về trước
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: '#6C3483',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Tiếp theo
        </Button>
      </Box>
    </>
  )
}

export default QuestionList
