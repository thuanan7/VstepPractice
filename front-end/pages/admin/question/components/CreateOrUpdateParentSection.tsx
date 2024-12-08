import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import SessionPartParentForm, {
  FormDataSession,
} from './section-part/SessionPartParentForm'

interface CreateOrUpdateParentSectionProps {
  id?: number
}
const CreateOrUpdateParentSection = (
  props: CreateOrUpdateParentSectionProps,
) => {
  const { id = undefined } = props
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = (data: FormDataSession) => {
    if (id) {
    } else {
      console.log('adssdas', data)
    }
  }
  return (
    <div>
      <Button
        variant="contained"
        color={id ? 'primary' : 'warning'}
        startIcon={id ? <AddCircleIcon /> : <EditIcon />}
        onClick={handleClickOpen}
        sx={{
          fontSize: '16px',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: id
              ? 'rgba(0, 0, 255, 0.7)'
              : 'rgba(255, 165, 0, 0.7)',
          },
        }}
      >
        {id ? 'Tạo mới' : 'Cập nhật'}
      </Button>
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle> {id ? 'Tạo mới' : 'Cập nhật'} Session</DialogTitle>
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
