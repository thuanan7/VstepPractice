import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { List, Box } from '@mui/material'
import QuestionItem from './QuestionItem'
import { IQuestion, ISessionPart } from '@/features/exam/type'
import { questionRequest } from '@/app/api'
import { toast } from 'react-hot-toast'

export interface QuestionManagerHandle {
  addQuestion: () => Promise<void>
}

interface QuestionManagerProps {
  part: ISessionPart
}

const QuestionManager = forwardRef<QuestionManagerHandle, QuestionManagerProps>(
  (props, ref) => {
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

    const handleRemoveQuestion = (questionId: number) => {
      const updatedQuestions = questions.filter((q) => q.id !== questionId)
      setQuestions(updatedQuestions)
    }

    const handleAddEmptyOption = async (idQuestion: number) => {
      try {
        const response = await questionRequest.createEmptyOption(idQuestion)
        if (response) {
          toast.success('Tạo option thành công')
          setQuestions((prevQuestions) =>
            prevQuestions.map((question) => {
              if (question.id === idQuestion) {
                return {
                  ...question,
                  options: [...question.options, response],
                }
              }
              return question
            }),
          )
        } else {
          toast.error('Tạo option thất bại')
        }
      } catch (e) {
        console.error('Error creating empty option:', e)
      }
    }

    useImperativeHandle(ref, () => ({
      addQuestion: async () => {
        try {
          const response = await questionRequest.createEmptyQuestion(part.id)
          if (response) {
            toast.success('Tạo câu hỏi mới thành công')
            console.log('dsdsadsa', response)
            setQuestions((prevQuestions) => [...prevQuestions, response])
          } else {
            toast.error('Tạo câu hỏi mới thất bại')
          }
        } catch (e) {
          console.error('Error adding new question:', e)
        }
      },
    }))

    const renderItem = (question: IQuestion, index: number) => {
      const opening = openQuestionId === question.id
      return (
        <div key={`${question.id}_${index}`}>
          <QuestionItem
            question={question}
            opening={opening}
            onOpen={handleClickQuestion}
            onRemoveQuestion={handleRemoveQuestion}
            onAddOption={handleAddEmptyOption}
          />
        </div>
      )
    }

    return (
      <Box p={2}>
        <List>{questions.map(renderItem)}</List>
      </Box>
    )
  },
)

export default QuestionManager
