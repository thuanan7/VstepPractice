import APIClient from '@/app/api/axios/AxiosClient'
import { storePathConfigs } from './configs'
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
    return super
      .get(storePathConfigs.list, undefined, cancelToken)
      .then((r) => {
        if (r?.success) {
          return r?.data as IExam[]
        }
        return undefined
      })
  }
}
