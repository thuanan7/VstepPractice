import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SingleQuestionSection from '../questions/SingleQuestionSection'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectPartBySectionAndPartId,
  selectPartsBySectionId,
  selectPreviousNextPart,
  selectStudentAnswer,
} from '@/features/exam/attemptSelector'
import { IAttemptStudentAnswer, SectionType } from '@/features/exam/type.ts'
import TextQuestionSection from '../questions/TextQuestionSection'
import SpeakingQuestionSection from '../questions/SpeakingQuestionSection'
import ListeningSection from '../instructions/ListeningSection'
import ReadingSection from '../instructions/ReadingSection'
import { startDoPart } from '@/features/exam/attemptSlice.ts'
import { attemptRequest } from '@/app/api'
import { toast } from 'react-hot-toast'
import { SectionPartTypes } from '@/features/exam/configs.ts'

const AttemptContent = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const sectionId = Number(searchParams.get('sectionId'))
  const partId = searchParams.get('partId')
    ? Number(searchParams.get('partId'))
    : null
  const { part, attemptId, sectionType } = useSelector(
    selectPartBySectionAndPartId(sectionId, partId),
  )
  const answer = useSelector(selectStudentAnswer)
  const sections = useSelector(selectPartsBySectionId(`${sectionId}`))
  const { previousPart, nextPart } = useSelector(
    selectPreviousNextPart(sectionId, partId),
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sectionId) {
      setLoading(true)
    } else if (sectionId && !partId && !part) {
      if (sections.length === 0) {
        setLoading(false)
      } else {
        setSearchParams({
          sectionId: String(sectionId),
          partId: String(sections[0].id),
        })
      }
    } else {
      dispatch(
        startDoPart({
          partId: part?.id || 0,
          sectionType,
          partType: part?.type || SectionPartTypes.Part,
        }),
      )
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
  const handleNext = async () => {
    if (nextPart && attemptId && answer) {
      setLoading(true)
      let submiSection = null
      if (sectionType === SectionType.Speaking) {
        submiSection = await handleSendSpeakingSubmit(
          part?.type || SectionPartTypes.Part,
          attemptId,
          answer,
        )
      } else {
        submiSection = await handleSendSubmit(attemptId, answer)
      }
      if (submiSection) {
        const currentParams = new URLSearchParams(searchParams)
        currentParams.set('partId', `${nextPart.partId}`)
        currentParams.set('sectionId', `${nextPart.sectionId}`)
        setSearchParams(currentParams)
      } else {
        toast.error('Không thể submit câu trả lời')
      }
      setLoading(false)
    }
  }
  const handleSendSubmit = async (
    _attemptId: number,
    _answer: IAttemptStudentAnswer,
  ) => {
    try {
      const rs = await attemptRequest.sendSubmitAttempt(_attemptId, _answer)
      return !rs
    } catch (e) {
      return false
    }
  }
  const handleSendSpeakingSubmit = async (
    _partType: number,
    _attemptId: number,
    _answer: IAttemptStudentAnswer,
  ) => {
    try {
      const rs = await attemptRequest.sendSpeakingSubmitAttempt(
        _partType,
        _attemptId,
        _answer,
      )
      return !rs
    } catch (e) {
      return false
    }
  }

  const handlePrevious = () => {
    if (previousPart) {
      const currentParams = new URLSearchParams(searchParams)
      currentParams.set('partId', `${previousPart.partId}`)
      currentParams.set('sectionId', `${previousPart.sectionId}`)
      setSearchParams(currentParams)
      setSearchParams(currentParams)
    }
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
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 1,
          boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Button
          variant="outlined"
          color="success"
          onClick={handlePrevious}
          disabled={!previousPart}
          startIcon={<ArrowBackIcon />}
          sx={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Trở về trước
        </Button>
        {nextPart && (
          <Button
            variant="contained"
            color="success"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            sx={{
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Tiếp theo
          </Button>
        )}
      </Box>
    </>
  )
}

export default AttemptContent
