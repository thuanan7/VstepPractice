import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IExam } from './type'
export interface IAdminExam {
  exam?: IExam
}
const initialState: IAdminExam = { exam: undefined }
export const ExamAdminSlice = createSlice({
  name: 'examAdmin',
  initialState,
  reducers: {
    manage: (state, action: PayloadAction<IExam>) => {
      if (state.exam && state.exam.id === action.payload.id) {
        state.exam = action.payload
      }
    },
  },
})
export const { manage } = ExamAdminSlice.actions
export const examAdminReducer = ExamAdminSlice.reducer
