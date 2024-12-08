import APIClient, { paramsToUrl } from '@/app/api/axios/AxiosClient'
import { sectionPartsPathConfigs } from './configs'
import { Section } from '@/features/exam/type'

export default class SectionPartClient extends APIClient {
  sectionPartsByType(examId: string, type: number, cancelToken?: any) {
    const subParams = paramsToUrl({ examId, type })
    console.log('aaaaa', { subParams, type })
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
}
