import { IGetWebByIdResp, IReqEditWebsite } from './types';

export function mappingWebsiteToFrom(data: IGetWebByIdResp): IReqEditWebsite {
  const {
    name = '',
    url = '',
    time = 0,
    isSpecial = false,
    specialKey = '',
    schemas = [],
  } = data?.data || { name: '', url: '', time: 0, isSpecial: false, specialKey: '', schemas: [] };
  return { name, url, time, isSpecial, specialKey, schemas };
}
