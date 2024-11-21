import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useState } from 'react'

const CreateOrUpdateSectionPart = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogData, setDialogData] = useState<any>({
    id: null,
    title: '',
    instructions: '',
    order_num: '',
  })
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSave = () => {
    // if (dialogData.id) {
    //   setSectionParts((prev) =>
    //     prev.map((part) => (part.id === dialogData.id ? dialogData : part)),
    //   )
    // } else {
    //   setSectionParts((prev) => [
    //     ...prev,
    //     { ...dialogData, id: prev.length + 1 },
    //   ])
    // }
    setOpenDialog(false)
  }

  const handleOpenDialog = (
    data: any = { id: null, title: '', instructions: '', order_num: '' },
  ) => {
    setDialogData(data)
    setOpenDialog(true)
  }
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
          sx={{ marginTop: 2 }}
        >
          Add New Section
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogData.id ? 'Edit' : 'Add'} Listening Section Part
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Instructions"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={dialogData.instructions}
            onChange={(e) =>
              setDialogData({ ...dialogData, instructions: e.target.value })
            }
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Audio
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{ display: 'block', marginTop: 1 }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept="audio/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0]
                    setDialogData({ ...dialogData, audioFile: file })
                  }
                }}
              />
            </Button>
            {dialogData.audioFile && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Selected File: {dialogData.audioFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default CreateOrUpdateSectionPart
