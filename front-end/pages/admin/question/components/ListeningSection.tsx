import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material'
import { Add, Edit, Delete, ExpandMore } from '@mui/icons-material'

// Mock data for section parts
const initialSectionParts = [
  {
    id: 1,
    title: 'Conversation 1',
    instructions: 'Listen to the conversation and answer the questions.',
    order_num: 1,
  },
  {
    id: 2,
    title: 'Conversation 2',
    instructions: 'Listen carefully and select the best answer.',
    order_num: 2,
  },
]

const SectionPartsManager: React.FC = () => {
  const [sectionParts, setSectionParts] = useState(initialSectionParts)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogData, setDialogData] = useState<any>({
    id: null,
    title: '',
    instructions: '',
    order_num: '',
  })

  const handleOpenDialog = (
    data: any = { id: null, title: '', instructions: '', order_num: '' },
  ) => {
    setDialogData(data)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSave = () => {
    if (dialogData.id) {
      // Edit Section Part
      setSectionParts((prev) =>
        prev.map((part) => (part.id === dialogData.id ? dialogData : part)),
      )
    } else {
      // Add New Section Part
      setSectionParts((prev) => [
        ...prev,
        { ...dialogData, id: prev.length + 1 },
      ])
    }
    setOpenDialog(false)
  }

  const handleDelete = (id: number) => {
    setSectionParts((prev) => prev.filter((part) => part.id !== id))
  }

  return (
    <Box sx={{ padding: 3 }}>
      {sectionParts.map((part) => (
        <Accordion key={part.id}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`panel${part.id}-content`}
            id={`panel${part.id}-header`}
          >
            <Typography>{`${part.order_num}. ${part.title}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" gutterBottom>
              Instructions: {part.instructions}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => alert(`Managing Questions for ${part.title}`)}
                  sx={{ marginRight: 1 }}
                >
                  Manage Questions
                </Button>
              </Box>
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => handleOpenDialog(part)}
                  sx={{ marginRight: 1 }}
                >
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(part.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ marginTop: 2 }}
        >
          Add New Section
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogData.id ? 'Edit' : 'Add'} Section Part</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={dialogData.title}
            onChange={(e) =>
              setDialogData({ ...dialogData, title: e.target.value })
            }
          />
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
          <TextField
            label="Order Number"
            fullWidth
            type="number"
            margin="normal"
            value={dialogData.order_num}
            onChange={(e) =>
              setDialogData({ ...dialogData, order_num: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SectionPartsManager
