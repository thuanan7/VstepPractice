import { useState, useRef } from 'react'
import { Box, Button, Typography } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { IAttemptQuestion } from '@/features/exam/type'

interface SingleQuestionSectionProps {
  questions: IAttemptQuestion[]
}

const SpeakingQuestionSection = (props: SingleQuestionSectionProps) => {
  const { questions } = props
  const [recordingState, setRecordingState] = useState<Map<number, boolean>>(
    new Map(),
  ) // Trạng thái ghi âm cho từng câu hỏi
  const [audioBlobs, setAudioBlobs] = useState<Map<number, Blob | null>>(
    new Map(),
  ) // Audio blobs cho từng câu hỏi
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map()) // Audio refs cho từng câu hỏi
  const mediaRecorderRefs = useRef<Map<number, MediaRecorder>>(new Map()) // MediaRecorder refs cho từng câu hỏi

  const handleStartRecording = async (questionId: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRefs.current.set(questionId, mediaRecorder)

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlobs((prev) => new Map(prev).set(questionId, blob))
      }

      mediaRecorder.start()
      setRecordingState((prev) => new Map(prev).set(questionId, true))
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const handleStopRecording = (questionId: number) => {
    const mediaRecorder = mediaRecorderRefs.current.get(questionId)
    if (mediaRecorder) {
      mediaRecorder.stop()
      setRecordingState((prev) => new Map(prev).set(questionId, false))
    }
  }

  const handlePlayAudio = (questionId: number) => {
    const audioBlob = audioBlobs.get(questionId)
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audioRef = audioRefs.current.get(questionId)
      if (audioRef) {
        audioRef.src = audioUrl
        audioRef.play()
      }
    }
  }

  return (
    <Box>
      {questions.map((question, index) => (
        <Box
          key={question.id}
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

          {/* Nút ghi âm */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 2,
            }}
          >
            {!recordingState.get(question.id) ? (
              <Button
                variant="contained"
                startIcon={<MicIcon />}
                onClick={() => handleStartRecording(question.id)}
                sx={{ fontSize: '16px', padding: '10px 20px' }}
              >
                Ghi âm
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<StopIcon />}
                color="error"
                onClick={() => handleStopRecording(question.id)}
                sx={{ fontSize: '16px', padding: '10px 20px' }}
              >
                Dừng
              </Button>
            )}
          </Box>

          {audioBlobs.get(question.id) && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => handlePlayAudio(question.id)}
                sx={{ fontSize: '16px', padding: '10px 20px' }}
              >
                Nghe lại
              </Button>
              <audio
                ref={(el) => {
                  if (el) audioRefs.current.set(question.id, el)
                }}
                hidden
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default SpeakingQuestionSection
