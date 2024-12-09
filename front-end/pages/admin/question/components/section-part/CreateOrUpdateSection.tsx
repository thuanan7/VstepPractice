import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import SessionForm, { FormDataSession } from './SessionForm.tsx'
import { sectionPartRequest } from '@/app/api'
import { SectionPartTypes } from '@/features/exam/configs'

import { toast } from 'react-hot-toast'
interface CreateOrUpdateParentSectionProps {
  id?: number
  examId: string
  onRefresh: (newValue: string) => void
}
const CreateOrUpdateSection = (props: CreateOrUpdateParentSectionProps) => {
  const { id = undefined, examId, onRefresh } = props
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = async (_data: FormDataSession) => {
    if (id) {
    } else {
      const created = await sectionPartRequest.createSessionPart({
        title: _data.title,
        instructions: _data.instructions,
        content: _data.content,
        orderNum: 0,
        sectionType: _data.sessionType,
        type: SectionPartTypes.Section,
        examId: parseInt(`${examId}`),
      })
      if (created) {
        handleClose()
        toast.success('Tạo session thành công')
        setTimeout(() => {
          onRefresh(created)
        }, 1000)
      } else {
        toast.error('Lỗi, hãy tạo lại')
      }
    }
  }
  return (
    <div>
      <Button
        color={!id ? 'inherit' : 'warning'}
        startIcon={!id ? <AddCircleIcon /> : <EditIcon />}
        onClick={handleClickOpen}
        sx={{
          fontSize: '16px',
        }}
      >
        {!id ? 'Tạo mới session' : 'Cập nhật'}
      </Button>
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle> {!id ? 'Tạo mới' : 'Cập nhật'} Session</DialogTitle>
        <DialogContent>
          <SessionForm onClose={handleClose} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateOrUpdateSection
