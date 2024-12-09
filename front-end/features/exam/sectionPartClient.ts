import APIClient, { paramsToUrl } from '@/app/api/axios/AxiosClient'
import { sectionPartsPathConfigs } from './configs'
import {
  IExam,
  IReqPostSessionPart,
  ISessionPart,
  Section,
} from '@/features/exam/type'

export default class SectionPartClient extends APIClient {
  sectionPartsByType(examId: string, type: number, cancelToken?: any) {
    const subParams = paramsToUrl({ examId, type })
    return super
      .get(
        `${sectionPartsPathConfigs.listByType}${subParams}`,
        undefined,
        cancelToken,
      )
      .then((r) => {
        if (r?.success) {
          return r?.data as Section[]
        }
        return undefined
      })
  }
  sectionPartsById(id: number, cancelToken?: any) {
    return super
      .get(
        `${sectionPartsPathConfigs.listByType}/${id}`,
        undefined,
        cancelToken,
      )
      .then((r) => {
        if (r?.success && r?.data) {
          const { exam, sessions } = r.data as {
            exam: IExam
            sessions: ISessionPart[]
          }
          return { exam, sessions }
        }
        return undefined
      })
  }

  createSessionPart(data: IReqPostSessionPart, cancelToken?: any) {
    return super
      .post(`${sectionPartsPathConfigs.listByType}`, data, cancelToken)
      .then((r) => {
        if (r?.success) {
          return `${r.data}`
        } else {
          return undefined
        }
      })
  }

  updateSessionPart(id: number, data: IReqPostSessionPart, cancelToken?: any) {
    return super
      .put(`${sectionPartsPathConfigs.listByType}/${id}`, data, cancelToken)
      .then((r) => {
        if (r?.success) {
          return `${r.data}`
        } else {
          return undefined
        }
      })
  }
  deleteSessionPart(id: number, cancelToken?: any) {
    return super
      .delete(
        `${sectionPartsPathConfigs.listByType}/${id}`,
        undefined,
        cancelToken,
      )
      .then((r) => {
        return r?.success
      })
  }
}
