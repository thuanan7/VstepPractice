import { Box } from '@mui/material'
import RemoveSession from './RemoveSession'
import { useNavigate } from 'react-router-dom'

interface SessionGeneralProps {
  sessionId: number
  examId: number
}
const SessionGeneral = (props: SessionGeneralProps) => {
  const { sessionId, examId } = props

  const navigate = useNavigate()
  const handleRefreshAfterRemove = () => {
    navigate(`/admin/questions/${examId}`)
    window.location.reload()
  }
  return (
    <Box
      flex={1}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box flex={1}>aaaa</Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <RemoveSession id={sessionId} onRefresh={handleRefreshAfterRemove} />
      </Box>
    </Box>
  )
}
export default SessionGeneral
