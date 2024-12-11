import APIClient, { getUrlGet } from '@/app/api/axios/AxiosClient'
import { attemptConfigs } from './configs'
import { IAttemptExam } from '@/features/exam/type'
export default class AttemptClient extends APIClient {
  getAttemptByExamId(examId: string, cancelToken?: any) {
    const subParams = getUrlGet(attemptConfigs.getAttemptByExamId, { examId })
    return super.get(subParams, undefined, cancelToken).then((r) => {
      if (r?.success) {
        return r?.data as IAttemptExam[]
      }
      return undefined
    })
  }
}
