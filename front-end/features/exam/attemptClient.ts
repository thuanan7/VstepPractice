import APIClient, { getUrlGet } from '@/app/api/axios/AxiosClient'
import { attemptConfigs } from './configs'
import {
  IAttemptExam,
  IStartStudentAttempt,
  ISumaryAttemptExam,
} from '@/features/exam/type'
import { formatDateTime } from './utils'
export default class AttemptClient extends APIClient {
  getExams(cancelToken?: any): Promise<ISumaryAttemptExam[] | undefined> {
    return super
      .get(attemptConfigs.getExams, undefined, cancelToken)
      .then((r) => {
        if (r?.success) {
          return r?.data as ISumaryAttemptExam[]
        }
        return undefined
      })
  }
  getAttemptByExamId(
    examId: string,
    cancelToken?: any,
  ): Promise<IAttemptExam[] | undefined> {
    const subParams = getUrlGet(attemptConfigs.getAttemptByExamId, { examId })
    return super.get(subParams, undefined, cancelToken).then((r) => {
      if (r?.success) {
        return r?.data as IAttemptExam[]
      }
      return undefined
    })
  }
  startAttempt(
    examId: string,
    cancelToken?: any,
  ): Promise<IStartStudentAttempt | undefined> {
    return super
      .post(attemptConfigs.startAttempt, { examId }, cancelToken)
      .then((r) => {
        if (r?.success) {
          return {
            attempId: r?.data?.id,
            examId: r?.data?.examId,
            title: r?.data?.examTitle,
            description: r?.data?.examDescription,
            status: r?.data?.status,
            attempts: r?.data?.attempts.map((x: any) => {
              return {
                id: x.id,
                startTime: formatDateTime(x.startTime),
                endTime: formatDateTime(x.endTime),
                finalCore: x.finalCore,
              }
            }),
          }
        }
        return undefined
      })
  }

  finishAttempt(
    attemptId: number,
    cancelToken?: any,
  ): Promise<IStartStudentAttempt | undefined> {
    const subParams = getUrlGet(attemptConfigs.finishAttempt, {
      id: attemptId,
    })
    return super.post(subParams, undefined, cancelToken).then((r) => {
      if (r?.success) {
        return r?.data
      }
      return undefined
    })
  }
}
