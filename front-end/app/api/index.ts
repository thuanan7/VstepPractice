import instance, { cancelToken } from './axios/AxiosInstance'
import {
  AuthRequest,
  ExamRequest,
  SectionPartRequest,
  QuestionRequest,
  PartRequest,
} from '@/app/api/requests'

const baseApiUrl = `${import.meta.env.VITE_BASE_URL || ''}/api`

export interface IResp<T> {
  data?: T
  status: boolean
  message?: string
}

const authRequest = new AuthRequest(baseApiUrl, instance)
const examRequest = new ExamRequest(baseApiUrl, instance)
const questionRequest = new QuestionRequest(baseApiUrl, instance)
const partRequest = new PartRequest(baseApiUrl, instance)
const sectionPartRequest = new SectionPartRequest(baseApiUrl, instance)
export {
  authRequest,
  examRequest,
  questionRequest,
  sectionPartRequest,
  partRequest,
  cancelToken,
}
