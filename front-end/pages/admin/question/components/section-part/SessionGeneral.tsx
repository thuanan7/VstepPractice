import { Box } from '@mui/material'
import RemoveSession from './RemoveSession'

interface SessionGeneralProps {
  sessionId: number
}
const SessionGeneral = (props: SessionGeneralProps) => {
  const { sessionId } = props
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
        <RemoveSession id={sessionId} onRefresh={() => {}} />
      </Box>
    </Box>
  )
}
export default SessionGeneral
