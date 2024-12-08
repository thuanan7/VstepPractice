import APIClient, { paramsToUrl } from '@/app/api/axios/AxiosClient'
import { sectionPartsPathConfigs } from './configs'
import { IRespSessionPart, ISessionPart, Section } from '@/features/exam/type'

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
        if (r?.success) {
          return r?.data as ISessionPart[]
        }
        return undefined
      })
  }
}
