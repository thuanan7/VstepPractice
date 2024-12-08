import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { Edit, Delete, ExpandMore } from '@mui/icons-material'
import { sectionPartRequest } from '@/app/api'
import { SectionPartType } from '@/features/exam/configs'
import { Section } from '@/features/exam/type'
import CreateOrUpdateSectionPart from './CreateOrUpdateSectionPart'

interface SectionPartsManagerProps {
  examId: string
}
const SectionPartsManager = (props: SectionPartsManagerProps) => {
  const { examId } = props
  const [sectionParts, setSectionParts] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSectionParts = async () => {
    try {
      setLoading(true)
      const res = await sectionPartRequest.sectionPartsByType(
        examId,
        SectionPartType.listening,
      )
      setSectionParts(res || [])
    } catch (error) {
      console.error('Error fetching section parts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSectionParts()
  }, [])

  const handleDelete = (id: number) => {
    setSectionParts((prev) => prev.filter((part) => part.id !== id))
  }

  return (
    <Box sx={{ padding: 3 }}>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        sectionParts.map((part) => (
          <Accordion key={part.id}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${part.id}-content`}
              id={`panel${part.id}-header`}
            >
              <Typography>{`${part.orderNum}. ${part.instructions}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      alert(`Managing Questions for ${part.title}`)
                    }
                    sx={{ marginRight: 1 }}
                  >
                    Manage Questions
                  </Button>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    // onClick={() => handleOpenDialog(part)}
                    sx={{ marginRight: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(part.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
      <CreateOrUpdateSectionPart />
    </Box>
  )
}

export default SectionPartsManager
