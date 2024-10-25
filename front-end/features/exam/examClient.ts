import APIClient from '@/app/api/axios/AxiosClient';
import { storePathConfigs } from './configs';
export default class ExamClient extends APIClient {
    exams(cancelToken?: any) {
        return super.get(storePathConfigs.list, undefined, cancelToken);
    }
}
