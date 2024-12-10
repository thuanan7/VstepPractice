import {
  Box,
  Button,
  Collapse,
  Divider,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material'
import { Question } from './'
import OptionList from './OptionList'

interface QuestionItemProps {
  opening: boolean
  onOpen: (id: number) => void
  onUpdateQuestion: () => void
  onRemoveQuestion: (id: number) => void
  question: Question
}
const QuestionItem = (props: QuestionItemProps) => {
  const { opening, onOpen, onRemoveQuestion, question } = props
  return (
    <Box
      sx={{
        border: opening ? '2px dashed #3f51b5' : 'none',
        borderRadius: '4px',
        marginBottom: '8px',
        paddingBottom: 1,
      }}
    >
      <ListItem
        button
        onClick={() => onOpen(question.id)}
        sx={{
          backgroundColor: opening ? 'lightblue' : 'transparent',
          borderRadius: '4px',
        }}
      >
        <ListItemText primary={question.questionText} />
      </ListItem>
      <Collapse in={opening} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 2, pr: 2 }}>
          <TextField
            label="Điểm số"
            type="number"
            value={question.point}
            // onChange={(e) =>
            //   setQuestions((prevQuestions) =>
            //     prevQuestions.map((q) =>
            //       q.id === question.id
            //         ? { ...q, point: Number(e.target.value) }
            //         : q,
            //     ),
            //   )
            // }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Câu hỏi"
            value={question.questionText}
            // onChange={(e) => handleUpdateQuestion(question.id, e.target.value)}
            fullWidth
            margin="normal"
          />
          <OptionList options={question.options} />
          <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              // onClick={() => handleAddOption(question.id)}
            >
              Thêm Option
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => onRemoveQuestion(question.id)}
            >
              Xóa Câu Hỏi
            </Button>
          </Box>
        </Box>
      </Collapse>
      <Divider />
    </Box>
  )
}
export default QuestionItem
