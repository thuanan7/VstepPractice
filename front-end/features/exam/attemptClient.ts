import APIClient, { getUrlGet } from '@/app/api/axios/AxiosClient'
import { attemptConfigs } from './configs'
import { IAttemptExam, IStartStudentAttempt } from '@/features/exam/type'
export default class AttemptClient extends APIClient {
  getAttemptByExamId(examId: string, cancelToken?: any): Promise<IAttemptExam[] | undefined> {
    const subParams = getUrlGet(attemptConfigs.getAttemptByExamId, { examId })
    return super.get(subParams, undefined, cancelToken).then((r) => {
      if (r?.success) {
        return r?.data as IAttemptExam[]
      }
      return undefined
    })
  }
  startAttempt(examId: string, cancelToken?: any): Promise<IStartStudentAttempt | undefined> {
    return super.post(attemptConfigs.startAttempt, { examId }, cancelToken).then((r) => {
      if (r?.success) {
        return {
          attempId: r?.data?.id,
          examId: r?.data?.examId,
          title: r?.data?.examTitle,
          description: r?.data?.examDescription,
          status: r?.data?.status,
        }
      }
      return undefined
    })
  }
}
