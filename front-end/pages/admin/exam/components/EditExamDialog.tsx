import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material'

interface Exam {
  id: number
  title: string
  description: string
}

interface EditExamDialogProps {
  open: boolean
  currentExam: Exam | null
  handleClose: () => void
  onSave: (updatedExam: Exam) => void
}

const EditExamDialog: React.FC<EditExamDialogProps> = ({
  open,
  currentExam,
  handleClose,
  onSave,
}) => {
  const [editedExam, setEditedExam] = useState<Exam>({
    id: currentExam?.id || 0,
    title: currentExam?.title || '',
    description: currentExam?.description || '',
  })

  // Xử lý khi người dùng thay đổi nội dung input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedExam((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveClick = () => {
    if (
      editedExam.title.trim() === '' ||
      editedExam.description.trim() === ''
    ) {
      alert('Cả tên đề thi và mô tả đều không được để trống!')
      return
    }
    void onSave(editedExam)
    void handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle>Sửa thông tin đề thi</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên đề thi"
          name="title"
          value={editedExam.title}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          margin="dense"
          label="Mô tả"
          name="description"
          value={editedExam.description}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          multiline
          minRows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditExamDialog
