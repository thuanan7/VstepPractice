import instance, {cancelToken} from './axios/AxiosInstance';
import {AuthRequest, ExamRequest} from '@/app/api/requests';

const baseApiUrl = `${import.meta.env.VITE_BASE_URL || ''}/api`;

export interface IResp<T> {
    data?: T;
    status: boolean;
    message?: string;
}

const authRequest = new AuthRequest(baseApiUrl, instance);
const examRequest = new ExamRequest(baseApiUrl, instance);
export {authRequest, examRequest, cancelToken};
