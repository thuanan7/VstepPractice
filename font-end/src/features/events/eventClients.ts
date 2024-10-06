import APIClient, { paramsToUrl } from '@/app/api/axios/AxiosClient';
import { apiConfigs } from '@/features/events/configs';

export default class EventClient extends APIClient {
  getAll(input?: any, cancelToken?: any) {
    const subUrl = paramsToUrl(input);
    return super.get(`${apiConfigs.getAll}${subUrl}`, undefined, cancelToken);
  }

  deleteById(id: number, cancelToken?: any) {
    return super.delete(`${apiConfigs.deleteConferenceById}${id}`, undefined, cancelToken);
  }
}
