// import * as RootNavigation from '@/app/routes/rootNavigation';
// import { RouteName } from '@/app/routes/routeConfigs';
import { AXIOS_TIMEOUT } from '@/features/core/configs';
import axios from 'axios';
import i18next from 'i18next';
import { getData } from '@/features/core/ls';
import { keyLs } from '@/features/auth/configs';
declare module 'axios' {
  export interface AxiosInstance {
    ignoreError: boolean;
  }
}

const axiosInstance = axios.create({
  timeout: AXIOS_TIMEOUT,
  headers: {
    'content-type': 'application/json',
  },
});
declare module 'axios' {
  export interface AxiosInstance {
    ignoreError: boolean;
  }
}
axiosInstance.interceptors.request.use(
  async config => {
    const tokenValue = getData<string>(keyLs.accessToken);
    if (tokenValue) {
      config.headers.Authorization = `Bearer ${tokenValue}`;
    }

    return config;
  },
  error => {
    void Promise.reject(error).then(r => console.log(r));
  },
);

const redirectToLogin = () => {
  // session.logout();
  // RootNavigation.reset(RouteName.Authenticate, 0);
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const messageError = error.response.data?.error?.message || error.message;
    if (axios.isCancel(error)) {
      return new Promise(r => {
        console.log('Cancel:', r);
      });
    }
    if (!axiosInstance.ignoreError) {
      if (error.response['headers']['token-expired']) {
        redirectToLogin();
      }
      if (error.response && error.response.data && error.response.data.split) {
        const localeError = error.response.data.split && error.response.data.split('Locale: ')[1];
        console.log('axios error:', i18next.t(localeError));
      } else {
        console.log('axios error:', messageError);
      }
      console.log(error);
    }

    if (
      error.request.responseType === 'blob' &&
      error.response.data instanceof Blob &&
      error.response.data.type &&
      error.response.data.type.toLowerCase().indexOf('json') !== -1
    ) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          error.response.data = JSON.parse(reader.result as string);
          resolve(
            Promise.reject({
              ...error,
              message: messageError,
            }),
          );
        };

        reader.onerror = () => {
          reject({
            ...error,
            message: messageError,
          });
        };
        reader.readAsText(error?.response?.data);
      });
    }

    return Promise.reject({
      ...error,
      message: messageError,
    });
  },
);
export const cancelToken = axios.CancelToken;
export default axiosInstance;
