import APIClient from '@/app/api/axios/AxiosClient';
import { apiConfigs } from './configs';
import { IReqEditWebsite } from '@/features/website-crawl/types';

export default class WebsiteClient extends APIClient {
  getAll(cancelToken?: any) {
    return super.get(apiConfigs.getAll, undefined, cancelToken);
  }
  getById(id: string, cancelToken?: any) {
    return super.get(`${apiConfigs.getById}${id}`, undefined, cancelToken);
  }

  postCrawlManual(id: string, cancelToken?: any) {
    return super.post(`${apiConfigs.crawlManual}/${id}`, undefined, cancelToken);
  }
  postWebsite(params: IReqEditWebsite, cancelToken?: any) {
    return super.post(apiConfigs.create, params, cancelToken);
  }

  putWebsite(id: number, params: IReqEditWebsite, cancelToken?: any) {
    return super.put(`${apiConfigs.put}${id}`, params, cancelToken);
  }

  deleteWebsite(id: number, cancelToken?: any) {
    return super.delete(`${apiConfigs.delete}${id}`, undefined, cancelToken);
  }
}
