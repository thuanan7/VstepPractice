import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  IAttemptAnswer,
  IAttemptExam,
  IAttemptStudentAnswer,
  IStartStudentAttempt,
  SectionType,
} from './type'
export interface IAttempExam {
  examId?: number
  sections?: IAttemptExam[]
  attempt?: IStartStudentAttempt
  answer?: IAttemptStudentAnswer
}
const initialState: IAttempExam = {}
export const ExamStudentSlice = createSlice({
  name: 'examStudent',
  initialState,
  reducers: {
    setAttempt(
      state,
      action: PayloadAction<{
        examId: number
        attempt: IStartStudentAttempt
        sections: IAttemptExam[]
      }>,
    ) {
      const { examId, sections, attempt } = action.payload
      state.examId = examId
      state.attempt = attempt
      state.sections = sections
    },
    resetAttempt(state) {
      state.sections = undefined
      state.attempt = undefined
    },
    startDoPart(
      state,
      action: PayloadAction<{
        partId: number
        sectionType: SectionType
      }>,
    ) {
      const { partId, sectionType } = action.payload
      if (state.answer && state.answer.partId !== partId) {
        state.answer = {
          section: sectionType,
          partId: partId,
          questions: [],
        }
      }
    },
    saveAnswer(state, action: PayloadAction<IAttemptAnswer>) {
      const { id, answer } = action.payload
      const existingAnswerIndex = state.answer!.questions.findIndex(
        (a) => a.id === id,
      )
      if (existingAnswerIndex !== -1) {
        state.answer!.questions[existingAnswerIndex].answer = answer
      } else {
        state.answer!.questions.push({ id, answer })
      }
    },
  },
})
export const { setAttempt, saveAnswer, startDoPart, resetAttempt } =
  ExamStudentSlice.actions
export const examStudentReducer = ExamStudentSlice.reducer
