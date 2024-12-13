import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAttemptExam, IStartStudentAttempt } from './type'
export interface IAttempExam {
  examId?: number
  sections?: IAttemptExam[]
  attempt?: IStartStudentAttempt
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
  },
})
export const { setAttempt, resetAttempt } = ExamStudentSlice.actions
export const examStudentReducer = ExamStudentSlice.reducer
