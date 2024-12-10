import APIClient, { getUrlGet } from '@/app/api/axios/AxiosClient'
import { sectionPartsPathConfigs } from '@/features/exam/configs'
import { IQuestion } from '@/features/exam/type'
export default class QuestionClient extends APIClient {
  questionsByPartId(partId: number, cancelToken?: any) {
    const subParams = getUrlGet(sectionPartsPathConfigs.questions, { partId })
    return super.get(subParams, undefined, cancelToken).then((r) => {
      if (r?.success) {
        return r?.data as IQuestion[]
      }
      return undefined
    })
  }
  getQuestions() {}
  createQuestion() {}
  updateQuestion() {}
  deleteQuestion() {}
  getOptions() {}

  createOption() {}

  updateOption() {}

  deleteOption() {}
}
