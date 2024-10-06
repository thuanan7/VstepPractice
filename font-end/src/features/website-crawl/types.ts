import { KeySchemas } from '@/features/website-crawl/configs';

export interface IBaseWebsiteCrawl {
  name: string;
  url: string;
}
export interface IGetWebByIdResp {
  error: string;
  data?: IWebsiteCrawl;
}

export const DefaultSchemas: IReqSchema[] = [
  { key: KeySchemas.main, value: '', position: 0, type: 'text' },
  { key: KeySchemas.rows, value: '', position: 0, type: 'text' },
  { key: KeySchemas.url, value: '', position: 0, type: 'text' },
  { key: KeySchemas.title, value: '', position: 0, type: 'text' },
  { key: KeySchemas.deadline, value: '', position: 0, type: 'text' },
  { key: KeySchemas.description, value: '', position: 0, type: 'text' },
  { key: KeySchemas.date, value: '', position: 0, type: 'text' },
  { key: KeySchemas.location, value: '', position: 0, type: 'text' },
];
export const DefaultWebSiteReq: IReqEditWebsite = {
  name: '',
  url: '',
  time: 0,
  isSpecial: false,
  schemas: DefaultSchemas,
};
export interface IWebsiteCrawl extends IBaseWebsiteCrawl {
  id: number;
  time?: number;
  isSpecial?: boolean;
  specialKey?: string;
  schemas?: IReqSchema[];
}

export interface IReqEditWebsite extends IBaseWebsiteCrawl {
  time: number;
  isSpecial?: boolean;
  specialKey?: string;
  schemas?: IReqSchema[];
}

export interface IReqSchema {
  key: number;
  value: string;
  position?: number;
  type?: string;
}
