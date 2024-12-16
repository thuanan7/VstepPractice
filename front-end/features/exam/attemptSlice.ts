import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  IAttemptAnswer,
  IAttemptExam,
  IAttemptStudentAnswer,
  IStartStudentAttempt,
  ISubmitStudentAttempt,
  SectionType,
} from './type'
import { RootState } from '@/app/store'
import { attemptRequest } from '@/app/api'
import {
  KEY_SUBMIT_RESPONSE,
  SectionPartTypes,
} from '@/features/exam/configs.ts'
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
      state.examId = undefined
    },
    startDoPart(
      state,
      action: PayloadAction<{
        partId: number
        sectionType: SectionType
        partType: SectionPartTypes
      }>,
    ) {
      const { partId, sectionType, partType } = action.payload
      if (state.answer && state.answer.partId !== partId) {
        state.answer = {
          sectionType: sectionType,
          partType: partType,
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

export interface IReqSubmitAttemptPart {
  callback: (data: { success: boolean; key?: string }) => void
}
export const submitAttemptPart = createAsyncThunk<
  any,
  IReqSubmitAttemptPart,
  { state: RootState }
>(
  'examAdmin/submitAttemptPart',
  async ({ callback }, { getState, rejectWithValue }) => {
    const state = getState() as RootState
    const { answer, attempt } = state.examStudent
    if (!answer || !attempt) {
      return rejectWithValue({ success: false })
    }

    if (answer.questions.length === 0) {
      callback({ success: false, key: KEY_SUBMIT_RESPONSE.QUESTION_EMPTY })
      return rejectWithValue('ERROR')
    }
    const { sectionType, partType } = answer
    try {
      const rs: ISubmitStudentAttempt | undefined = await handleSubmitSection[
        sectionType === SectionType.Speaking ? 'speaking' : 'normal'
      ](partType, attempt.attempId, answer)
      if (rs) {
        callback({ success: true })
        return rs
      } else {
        callback({ success: false, key: KEY_SUBMIT_RESPONSE.API_BACK_ERROR })
        return rejectWithValue('ERROR')
      }
    } catch (error) {
      callback({ success: false, key: KEY_SUBMIT_RESPONSE.API_BACK_ERROR })
      return rejectWithValue('ERROR')
    }
  },
)

const handleSubmitSection: {
  [key: string]: (
    _partType: number,
    _attemptId: number,
    _answer: IAttemptStudentAnswer,
  ) => Promise<ISubmitStudentAttempt | undefined>
} = {
  ['normal']: (
    _partType: number,
    _attemptId: number,
    _answer: IAttemptStudentAnswer,
  ) => {
    return attemptRequest.sendSubmitAttempt(_partType, _attemptId, _answer)
  },
  ['speaking']: (
    _partType: number,
    _attemptId: number,
    _answer: IAttemptStudentAnswer,
  ) => {
    return attemptRequest.sendSpeakingSubmitAttempt(
      _partType,
      _attemptId,
      _answer,
    )
  },
}
