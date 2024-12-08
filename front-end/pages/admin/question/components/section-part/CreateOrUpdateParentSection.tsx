import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import SessionPartParentForm, { FormDataSession } from './SessionPartParentForm'
import { sectionPartRequest } from '@/app/api'
import { SectionPartTypes } from '@/features/exam/configs'

import { toast } from 'react-hot-toast'
interface CreateOrUpdateParentSectionProps {
  id?: number
  examId: string
  onRefresh: () => void
}
const CreateOrUpdateParentSection = (
  props: CreateOrUpdateParentSectionProps,
) => {
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
          onRefresh()
        }, 1000)
      } else {
        toast.error('Lỗi, hãy tạo lại')
      }
    }
  }
  return (
    <div>
      <Button
        variant="contained"
        color={!id ? 'primary' : 'warning'}
        startIcon={!id ? <AddCircleIcon /> : <EditIcon />}
        onClick={handleClickOpen}
        sx={{
          fontSize: '16px',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: !id
              ? 'rgba(0, 0, 255, 0.7)'
              : 'rgba(255, 165, 0, 0.7)',
          },
        }}
      >
        {!id ? 'Tạo mới' : 'Cập nhật'}
      </Button>
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle> {!id ? 'Tạo mới' : 'Cập nhật'} Session</DialogTitle>
        <DialogContent>
          <SessionPartParentForm
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateOrUpdateParentSection
