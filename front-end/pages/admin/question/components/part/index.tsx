import { useEffect, useState } from 'react'
import {
  Button,
  Box,
  List,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material'
import { sectionPartRequest } from '@/app/api'
import { ISessionPart } from '@/features/exam/type'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import PartForm from '@/pages/admin/question/components/part/PartForm.tsx'

interface PartManagementProps {
  examId: number
  sectionId: number
}

const PartManagement = (props: PartManagementProps) => {
  const { sectionId } = props
  const [open, setOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState<number | null>(null) // Store which part is selected
  const [parts, setParts] = useState<ISessionPart[]>([])
  useEffect(() => {
    void fetchParts()
  }, [sectionId])

  const fetchParts = async () => {
    const response = await sectionPartRequest.partsBySectionId(sectionId)
    if (response && response.length > 0) {
      void setParts(response)
    } else {
      setParts([])
    }
  }

  const handlePartSelect = (id: number) => {
    setSelectedPart(id)
  }

  const handleCreatePart = () => {
    setOpen(true)
  }
  return (
    <Box>
      <List>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleCreatePart}
          sx={{
            border: '2px dashed',
            color: 'text.secondary',
            borderColor: 'text.secondary',
            borderRadius: '4px',
            padding: '8px',
            transition: 'background-color 0.3s',
            width: '100%',
          }}
        >
          Tạo mới part
        </Button>
        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle> Tạo mới Part</DialogTitle>
          <DialogContent>
            <PartForm onClose={() => setOpen(false)} onSubmit={() => {}} />
          </DialogContent>
        </Dialog>
        {parts.map((part) => (
          <ListItemButton
            key={part.id}
            onClick={() => handlePartSelect(part.id)}
            selected={selectedPart === part.id}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
              '&:hover': {
                backgroundColor: 'primary.light',
              },
              transition: 'background-color 0.3s',
            }}
          >
            <ListItemText
              primary={part.title}
              sx={{
                whiteSpace: 'nowrap', // Prevent line break
                overflow: 'hidden', // Hide overflow text
                textOverflow: 'ellipsis', // Show "..." when text overflows
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}

export default PartManagement
