import { websiteRequest } from '@/app/api';
import { IGetWebByIdResp, IReqEditWebsite, IWebsiteCrawl } from './types';

interface IGetAllWebResp {
  error: string;
  data: IWebsiteCrawl[];
  autoJob: boolean;
  enabledJob: boolean;
}

export const getAllSync = async (): Promise<IGetAllWebResp> => {
  const rs: IGetAllWebResp = { error: 'Cant get data website', data: [], autoJob: false, enabledJob: true };
  try {
    const params = await websiteRequest.getAll();
    const data = (params?.data.websites || []).map((x: any) => ({
      id: x?.id,
      name: x?.name,
      url: x?.url,
      isSpecial: x.type === 0,
    }));
    if (params?.success) {
      rs.error = '';
      rs.data = data;
      rs.autoJob = params?.data?.autoJob;
      rs.enabledJob = params?.data?.enabledJob;
    } else if (params?.message) {
      rs.error = params.message;
    }
    return rs;
  } catch (e) {
    return rs;
  }
};

export const sendWebsiteData = async (params: IReqEditWebsite, id?: number): Promise<boolean> => {
  try {
    if (id) {
      const rsPut = await websiteRequest.putWebsite(id, params);
      if (rsPut?.success) return true;
    } else {
      const rsPost = await websiteRequest.postWebsite(params);
      if (rsPost?.success) return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const deleteWebsite = async (id: number): Promise<boolean> => {
  try {
    const rs = await websiteRequest.deleteWebsite(id);
    if (rs?.success) return true;
    return false;
  } catch (e) {
    return false;
  }
};
export const getByIdSync = async (id: string): Promise<IGetWebByIdResp> => {
  const rs: IGetWebByIdResp = { error: 'Cant get data website', data: undefined };
  try {
    const data = await websiteRequest.getById(id);
    if (data?.success && data.data) {
      const x = data.data;
      rs.error = '';
      rs.data = {
        id: x?.id,
        name: x?.name,
        url: x?.url,
        time: x?.timeCrawl || 0,
        isSpecial: x?.type === 0,
        specialKey: x?.specialKey || '',
        schemas: x?.schemas || [],
      };
    } else if (data?.message) {
      rs.error = data.message;
    }
    return rs;
  } catch (e) {
    return rs;
  }
};
export const postCrawlManual = async (id: string) => {
  const rs: IGetWebByIdResp = { error: 'Cant get data website', data: undefined };
  try {
    const data = await websiteRequest.postCrawlManual(id);
    return data?.success || false;
  } catch (e) {
    return rs;
  }
};
