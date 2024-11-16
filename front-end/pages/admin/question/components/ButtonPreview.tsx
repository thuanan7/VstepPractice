import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useState } from 'react'

interface ButtonPreviewProps {
  examId: string
}
const ButtonPreview = (props: ButtonPreviewProps) => {
  const [openPreviewModal, setOpenPreviewModal] = useState(false)

  const handlePreview = () => {
    setOpenPreviewModal(true)
  }

  const handleClosePreview = () => {
    setOpenPreviewModal(false)
  }
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePreview}
        sx={{ ml: 2 }}
      >
        Preview
      </Button>
      <Dialog
        open={openPreviewModal}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Exam Preview</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            This is a preview of the exam. Review all sections and questions.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Here you can include detailed exam content or a summary of all
            sections with questions for review before submission or publishing.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePreview}
            variant="outlined"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default ButtonPreview
