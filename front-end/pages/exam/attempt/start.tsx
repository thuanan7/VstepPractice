import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { RootState } from '@/app/store'
import AttemptSections from './components/attempts/AttemptSections'
import AttemptQuestionMenu from './components/attempts/AttemptQuestionMenu'
import AttemptContent from './components/attempts/AttemptContent'
import AttemptTimer from './components/attempts/AttemptTimmer'
import { attemptRequest } from '@/app/api'

const AttemptStart = () => {
  const navigate = useNavigate()
  const { attempt, sections } = useSelector(
    (state: RootState) => state.examStudent,
  )

  useEffect(() => {
    if (!attempt || !sections) {
      toast.error('Dữ liệu không hợp lệ, vui lòng thử lại!')
      setTimeout(() => {
        navigate('/exam')
      }, 500)
    }
  }, [attempt, sections, navigate])

  const handleForceSubmit = async () => {
    if (attempt && attempt.attempId) {
      const response = await attemptRequest.finishAttempt(attempt.attempId)
      if (response) {
        toast.success('Gửi bài thi thành công!')
        setTimeout(() => {
          navigate(`/exam/${attempt.examId}/attempts`, { replace: true })
        }, 200)
      } else {
        toast.error('Không thể kết thúc bài thi, vui lòng thử lại!')
      }
    }
  }
  const handleBackStartPage = (path?: string) => {
    setTimeout(() => {
      navigate(path ? path : `/exam`, { replace: true })
    }, 100)
  }
  const handleSubmitPart = () => {
    console.log('aaaaa')
  }
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      sx={{ height: 'calc(100vh - 70px)', overflow: 'hidden' }}
    >
      <AttemptTimer
        onEnd={handleForceSubmit}
        attempt={attempt}
        onBack={handleBackStartPage}
      />
      <Grid spacing={2} container sx={{ flex: 1, padding: 2 }}>
        <Grid item xs={2} sx={{ position: 'relative' }}>
          <AttemptSections />
        </Grid>
        <Grid item xs={8} sx={{ position: 'relative' }}>
          <AttemptContent />
        </Grid>
        <Grid item xs={2} sx={{ position: 'relative' }}>
          <AttemptQuestionMenu />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AttemptStart
