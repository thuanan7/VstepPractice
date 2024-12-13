import APIClient, { getUrlGet } from '@/app/api/axios/AxiosClient'
import { attemptConfigs } from './configs'
import {
  IAttemptExam,
  IAttemptStudentAnswer,
  IStartStudentAttempt,
  ISumaryAttemptExam,
  ISummaryStudentAttempt,
} from '@/features/exam/type'
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

  getSummaryAttemptsByExamId(
    examId: string,
    cancelToken?: any,
  ): Promise<ISummaryStudentAttempt | undefined> {
    const subParams = getUrlGet(attemptConfigs.getAttempts, { id: examId })
    return super.get(subParams, undefined, cancelToken).then((r) => {
      if (r?.success) {
        return r?.data as ISummaryStudentAttempt
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
          }
        }
        return undefined
      })
  }
  sendSubmitAttempt(
    attemptId: number,
    data: IAttemptStudentAnswer,
    cancelToken?: any,
  ): Promise<IStartStudentAttempt | undefined> {
    const subParams = getUrlGet(attemptConfigs.sendSubmit, {
      id: attemptId,
    })
    return super.post(subParams, data, cancelToken).then((r) => {
      if (r?.success) {
        return r?.data
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
