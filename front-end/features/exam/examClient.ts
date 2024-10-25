import APIClient from '@/app/api/axios/AxiosClient';
import {storePathConfigs} from './configs';
import {IExam} from "@/features/exam/type.ts";

export default class ExamClient extends APIClient {
    exams(cancelToken?: any) {
        return super.get(storePathConfigs.list, undefined, cancelToken).then(r => {
            if (r?.success) {
                return r?.data as IExam[]
            }
            return undefined;
        })
    }
}
