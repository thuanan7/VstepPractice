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

      state.answer = {
        section: sectionType,
        partId: partId,
        questions: [],
      }
    },
  },
})
export const { setAttempt, startDoPart, resetAttempt } =
  ExamStudentSlice.actions
export const examStudentReducer = ExamStudentSlice.reducer
