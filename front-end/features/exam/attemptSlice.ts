import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  IAttemptAnswer,
  IAttemptExam,
  IAttemptStudentAnswer,
  IStartStudentAttempt,
  IStartStudentAttemptDetail,
  ISubmitStudentAttempt,
  SectionType,
} from './type'
import { RootState } from '@/app/store'
import { attemptRequest } from '@/app/api'
import { SectionPartTypes } from '@/features/exam/configs.ts'
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
    resetAnswer(state) {
      state.attempt.details = []
      state.answer = undefined
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
export const {
  setAttempt,
  saveAnswer,
  resetAnswer,
  startDoPart,
  resetAttempt,
} = ExamStudentSlice.actions
export const examStudentReducer = ExamStudentSlice.reducer

export const submitAttemptPart = createAsyncThunk<
  {
    success: boolean
    isFinish: boolean
    details: IStartStudentAttemptDetail[]
  },
  void,
  { state: RootState }
>('examAdmin/submitAttemptPart', async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState

  const { answer, attempt } = state.examStudent
  if (answer && attempt) {
    const foundItem = attempt.details.find((item) => item.endTime === null)
    let rs: ISubmitStudentAttempt | boolean | undefined = false
    const { sectionType, partType } = answer
    if (sectionType === SectionType.Speaking) {
      rs = await handleSendSpeakingSubmit(
        foundItem?.id || 0,
        partType,
        attempt.attempId,
        answer,
      )
    } else {
      rs = await handleSendSubmit(
        foundItem?.id || 0,
        partType,
        attempt.attempId,
        answer,
      )
    }
    if (isSubmitStudentAttempt(rs)) {
      const isFinish = rs.details.isFinish
      return {
        success: true,
        isFinish: isFinish,
        details: isFinish ? [] : rs?.details?.items || [],
      }
    } else {
      return rejectWithValue({ success: false })
    }
  } else {
    return rejectWithValue({ success: false })
  }
})

const handleSendSubmit = async (
  _detailId: number,
  _partType: number,
  _attemptId: number,
  _answer: IAttemptStudentAnswer,
) => {
  try {
    const rs = await attemptRequest.sendSubmitAttempt(
      _detailId,
      _partType,
      _attemptId,
      _answer,
    )
    return rs
  } catch (e) {
    return false
  }
}
const handleSendSpeakingSubmit = async (
  _detailId: number,
  _partType: number,
  _attemptId: number,
  _answer: IAttemptStudentAnswer,
) => {
  try {
    const rs = await attemptRequest.sendSpeakingSubmitAttempt(
      _detailId,
      _partType,
      _attemptId,
      _answer,
    )
    return !rs
  } catch (e) {
    return false
  }
}
function isSubmitStudentAttempt(obj: any): obj is ISubmitStudentAttempt {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'details' in obj &&
    typeof obj.details.isFinish === 'boolean' &&
    Array.isArray(obj.details.items)
  )
}
