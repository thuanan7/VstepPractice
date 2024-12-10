import { useEffect, useState } from 'react'
import { List, Box } from '@mui/material'
import QuestionItem from './QuestionItem'
import { IQuestion, ISessionPart } from '@/features/exam/type'
import { questionRequest } from '@/app/api'

interface QuestionManagerProps {
  part: ISessionPart
}
const QuestionManager = (props: QuestionManagerProps) => {
  const { part } = props
  const [questions, setQuestions] = useState<IQuestion[]>([])
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(null)

  useEffect(() => {
    void fetchQuestions()
  }, [part.id])
  const fetchQuestions = async () => {
    const response = await questionRequest.questionsByPartId(part.id)
    if (response && response.length > 0) {
      void setQuestions(response)
    } else {
      setQuestions([])
    }
  }
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
