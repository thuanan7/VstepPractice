import APIClient from '@/app/api/axios/AxiosClient';
import { apiConfigs } from './configs';

export default class SettingClients extends APIClient {
  changeStatusAutoRun(status: boolean, cancelToken?: any) {
    return super.post(`${apiConfigs.changeAutoRun}`, { status }, cancelToken);
  }
}
