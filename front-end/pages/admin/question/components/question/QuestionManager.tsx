import React, { useState } from 'react'
import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  TextField,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material'

// Định nghĩa kiểu dữ liệu câu hỏi và option
interface Option {
  id: number
  content: string
  isCorrect: boolean
}

interface Question {
  id: number
  questionText: string
  point: number
  options: Option[]
}

const QuestionManager: React.FC = () => {
  // Danh sách câu hỏi giả
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      questionText: 'Câu hỏi 1: What is 2 + 2?',
      point: 1,
      options: [
        { id: 1, content: '3', isCorrect: false },
        { id: 2, content: '4', isCorrect: true },
        { id: 3, content: '5', isCorrect: false },
      ],
    },
    {
      id: 2,
      questionText: 'Câu hỏi 2: What is 3 + 3?',
      point: 1,
      options: [
        { id: 1, content: '5', isCorrect: false },
        { id: 2, content: '6', isCorrect: true },
        { id: 3, content: '7', isCorrect: false },
      ],
    },
    {
      id: 3,
      questionText: 'Câu hỏi 3: What is the capital of France?',
      point: 1,
      options: [
        { id: 1, content: 'Paris', isCorrect: true },
        { id: 2, content: 'London', isCorrect: false },
        { id: 3, content: 'Berlin', isCorrect: false },
      ],
    },
    {
      id: 4,
      questionText: 'Câu hỏi 4: What is 5 * 6?',
      point: 1,
      options: [
        { id: 1, content: '30', isCorrect: true },
        { id: 2, content: '35', isCorrect: false },
        { id: 3, content: '40', isCorrect: false },
      ],
    },
    {
      id: 5,
      questionText: 'Câu hỏi 5: What is the color of the sky?',
      point: 1,
      options: [
        { id: 1, content: 'Blue', isCorrect: true },
        { id: 2, content: 'Red', isCorrect: false },
        { id: 3, content: 'Green', isCorrect: false },
      ],
    },
  ])

  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null)

  const handleClickQuestion = (questionId: number) => {
    setOpenQuestionId(openQuestionId === questionId ? null : questionId)
  }

  const handleAddOption = (questionId: number) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        q.options.push({
          id: q.options.length + 1,
          content: '',
          isCorrect: false,
        })
      }
      return q
    })
    setQuestions(updatedQuestions)
  }

  const handleRemoveQuestion = (questionId: number) => {
    const updatedQuestions = questions.filter((q) => q.id !== questionId)
    setQuestions(updatedQuestions)
  }

  const handleUpdateQuestion = (questionId: number, updatedText: string) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        q.questionText = updatedText
      }
      return q
    })
    setQuestions(updatedQuestions)
  }

  const handleUpdateOption = (
    questionId: number,
    optionId: number,
    content: string,
    isCorrect: boolean,
  ) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        q.options = q.options.map((o) => {
          if (o.id === optionId) {
            o.content = content
            o.isCorrect = isCorrect
          } else {
            o.isCorrect = false
          }
          return o
        })
      }
      return q
    })
    setQuestions(updatedQuestions)
  }

  const handleRemoveOption = (questionId: number, optionId: number) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        q.options = q.options.filter((o) => o.id !== optionId)
      }
      return q
    })
    setQuestions(updatedQuestions)
  }

  return (
    <Box p={2}>
      <List>
        {questions.map((question) => (
          <div key={question.id}>
            <Box
              sx={{
                border:
                  openQuestionId === question.id
                    ? '2px dashed #3f51b5'
                    : 'none',
                borderRadius: '4px',
                marginBottom: '8px',
                paddingBottom: 1,
              }}
            >
              <ListItem
                button
                onClick={() => handleClickQuestion(question.id)}
                sx={{
                  backgroundColor:
                    openQuestionId === question.id
                      ? 'lightblue'
                      : 'transparent',
                  borderRadius: '4px',
                }}
              >
                <ListItemText primary={question.questionText} />
              </ListItem>
              <Collapse
                in={openQuestionId === question.id}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ pl: 2, pr: 2 }}>
                  <TextField
                    label="Câu hỏi"
                    value={question.questionText}
                    onChange={(e) =>
                      handleUpdateQuestion(question.id, e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                  <List>
                    {question.options.map((option) => (
                      <ListItem key={option.id}>
                        <TextField
                          label="Option"
                          value={option.content}
                          onChange={(e) =>
                            handleUpdateOption(
                              question.id,
                              option.id,
                              e.target.value,
                              option.isCorrect,
                            )
                          }
                          fullWidth
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={option.isCorrect}
                              onChange={(e) =>
                                handleUpdateOption(
                                  question.id,
                                  option.id,
                                  option.content,
                                  e.target.checked,
                                )
                              }
                            />
                          }
                          label="Đúng"
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            handleRemoveOption(question.id, option.id)
                          }
                        >
                          Xóa
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={2}
                    mb={2}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddOption(question.id)}
                    >
                      Thêm Option
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveQuestion(question.id)}
                    >
                      Xóa Câu Hỏi
                    </Button>
                  </Box>
                </Box>
              </Collapse>
              <Divider />
            </Box>
          </div>
        ))}
      </List>
    </Box>
  )
}

export default QuestionManager
