import React, { useState } from 'react'
import { List, Box } from '@mui/material'
import QuestionItem from './QuestionItem'

export interface Option {
  id: number
  content: string
  isCorrect: boolean
}

export interface Question {
  id: number
  questionText: string
  point: number
  options: Option[]
}

const QuestionManager: React.FC = () => {
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
  const handleOpenQuestion = (id: number) => {
    handleClickQuestion(id)
  }
  const renderItem = (question: Question, index: number) => {
    const opening = openQuestionId === question.id
    return (
      <div key={`${question.id}_${index}`}>
        <QuestionItem
          question={question}
          opening={opening}
          onOpen={handleOpenQuestion}
          onRemoveQuestion={handleRemoveQuestion}
        />
      </div>
    )
  }

  return (
    <Box p={2}>
      <List>{questions.map(renderItem)}</List>
    </Box>
  )
}

export default QuestionManager
