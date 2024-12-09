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
    manageExam: (state, action: PayloadAction<IExam>) => {
      state.exam = action.payload
    },
    resetExam: (state) => {
      state.exam = undefined
    },
  },
})
export const { manageExam, resetExam } = ExamAdminSlice.actions
export const examAdminReducer = ExamAdminSlice.reducer
