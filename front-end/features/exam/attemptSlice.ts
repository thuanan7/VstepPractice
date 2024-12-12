import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IExam, ISessionPart } from './type'
export interface IAttempExam {
  examId?: number,
  attemptId?: number
}
const initialState: IAttempExam = {

}
export const ExamStudentSlice = createSlice({
  name: 'examStudent',
  initialState,
  reducers: {
  },
})
// export const { manageExam, manageSection, resetExam } = ExamAdminSlice.actions
export const examStudentReducer = ExamStudentSlice.reducer
