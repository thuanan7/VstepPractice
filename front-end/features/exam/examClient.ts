import APIClient from '@/app/api/axios/AxiosClient'
import { examPathConfigs } from './configs'
import { IExam, SectionType } from '@/features/exam/type.ts'

export interface ISectionPartParams {
  title: string
  instructions: string
  orderNum: number
  type: SectionType
  examId?: number
  parentId?: number
}
export default class ExamClient extends APIClient {
  exams(cancelToken?: any) {
    return super.get(examPathConfigs.list, undefined, cancelToken).then((r) => {
      if (r?.success) {
        return r?.data as IExam[]
      }
      return undefined
    })
  }
  createNewExam(cancelToken?: any) {
    return super
      .post(examPathConfigs.createEmptyExam, undefined, cancelToken)
      .then((r) => {
        if (r?.success) {
          return r?.data as IExam
        }
        return undefined
      })
  }
}
