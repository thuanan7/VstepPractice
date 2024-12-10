import {
  Box,
  Button,
  Collapse,
  Divider,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material'
import OptionList from './OptionList'
import { IQuestion } from '@/features/exam/type'
import AddCircleIcon from '@mui/icons-material/AddCircle'

interface QuestionItemProps {
  opening: boolean
  onOpen: (id: number) => void
  onUpdateQuestion: () => void
  onRemoveQuestion: (id: number) => void
  onAddOption: (id: number) => void
  onRemoveOption: (questionId: number, id: number) => void
  question: IQuestion
}
const QuestionItem = (props: QuestionItemProps) => {
  const {
    opening,
    onOpen,
    onRemoveQuestion,
    onRemoveOption,
    question,
    onAddOption,
  } = props

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
          <OptionList
            questionId={question.id}
            options={question.options}
            onRemoveOption={onRemoveOption}
          />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={() => onAddOption(question.id)}
            sx={{
              border: '2px dashed',
              color: 'text.secondary',
              borderColor: 'text.secondary',
              borderRadius: '4px',
              padding: '8px',
              transition: 'background-color 0.3s',
              width: '100%',
              marginBottom: '8px',
            }}
          >
            Tạo mới option
          </Button>
          <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
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
