import { Box, Button } from '@mui/material'
import RemoveSession from './RemoveSession'
import { useNavigate } from 'react-router-dom'
import SessionForm from '@/pages/admin/question/components/section-part/SessionForm'
import { ISessionPart } from '@/features/exam/type'
import EditIcon from '@mui/icons-material/Edit'
import { useRef } from 'react'

interface SessionGeneralProps {
  session: ISessionPart
  examId: number
}
const SessionGeneral = (props: SessionGeneralProps) => {
  const { session, examId } = props
  const formRef = useRef<any>(null)
  const navigate = useNavigate()
  const handleRefreshAfterRemove = () => {
    navigate(`/admin/questions/${examId}`)
    window.location.reload()
  }
  const handleClickUpdate = () => {
    if (formRef.current) {
      formRef.current.triggerSubmit()
    }
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
      <Box
        flex={1}
        px={2}
        sx={{
          overflowX: 'auto',
          maxHeight: 'calc(100% - 50px)',
        }}
      >
        <SessionForm
          ref={formRef}
          data={{
            title: session.title,
            sectionType: session.sectionType,
            instructions: session.instructions,
            content: session.content,
            type: session.type,
            orderNum: 0,
          }}
          onClose={() => {}}
          onSubmit={(data) => {
            console.log('aaaa', data)
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} gap={2} mt={2}>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<EditIcon />}
          onClick={handleClickUpdate}
        >
          Cập nhật section
        </Button>
        <RemoveSession id={session.id} onRefresh={handleRefreshAfterRemove} />
      </Box>
    </Box>
  )
}
export default SessionGeneral
