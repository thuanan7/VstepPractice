import instance, { cancelToken } from './axios/AxiosInstance';
import { AuthRequest, WebsiteRequest, EventRequest, SettingRequest } from '@/app/api/requests';

const baseApiUrl = import.meta.env.VITE_BASE_URL || '';

export interface IResp<T> {
  data?: T;
  status: boolean;
  message?: string;
}

const authRequest = new AuthRequest(baseApiUrl, instance);
const eventRequest = new EventRequest(baseApiUrl, instance);
const settingRequest = new SettingRequest(baseApiUrl, instance);

const websiteRequest = new WebsiteRequest(baseApiUrl, instance);
export { authRequest, websiteRequest, settingRequest, eventRequest, cancelToken };
