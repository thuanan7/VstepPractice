import { LazyExoticComponent } from 'react';

export interface IAppState {
  appTitle: string | undefined;
  lang: string;
  ns: string;
}

// App Route
export interface IRoute {
  path: string;
  component: LazyExoticComponent<(props: Omit<{}, never>) => JSX.Element | null>;
  title?: string;
  name?: string;
}

export interface IRedirectRoute {
  from: string;
  to: string;
}

// page
export enum TypeAction {
  Create,
  Edit,
}

// api
export class ApiOutputModel implements IApiOutputModel {
  success!: boolean;
  message?: string | undefined;
  data?: any;
  meta?: any;

  constructor(data?: IApiOutputModel) {
    if (data) {
      for (const property in data) {
        if (Object.prototype.hasOwnProperty.call(data, property)) (this as any)[property] = (data as any)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.success = _data['success'];
      this.message = _data['message'];
      this.data = _data['data'];
      this.meta = _data['meta'];
    }
  }

  static fromJS(data: any): ApiOutputModel {
    data = typeof data === 'object' ? data : {};
    const result = new ApiOutputModel();
    result.init(data.data);
    return result;
  }
}

export interface IApiOutputModel {
  success: boolean;
  message?: string | undefined;
  data?: any;
  meta?: any;
}
