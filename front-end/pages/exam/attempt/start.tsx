import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { RootState } from '@/app/store'
import AttemptSections from './components/AttemptSections'
import AttemptQuestionMenu from './components/AttemptQuestionMenu'
import AttemptContent from './components/AttemptContent'
import AttemptTimer from './components/AttemptTimmer'
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

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      sx={{ height: 'calc(100vh - 70px)', overflow: 'hidden' }}
    >
      <AttemptTimer minutes={1} onTimeUp={() => {}} />
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
