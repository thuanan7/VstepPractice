import { authRequest, IResp } from '@/app/api';

export interface ILoginRespSuccess {
  accessToken: string;
}

export const loginSync = async (username: string, password: string): Promise<IResp<string | ILoginRespSuccess>> => {
  try {
    const rs = await authRequest.login({ username, password });
    const isLogInSuccess = rs?.success || false;
    return {
      status: isLogInSuccess,
      data: { accessToken: rs?.data?.token || '' },
      message: !isLogInSuccess ? rs?.message || '' : '',
    };
  } catch (e: any) {
    if (e?.status === 401) {
      return { status: false, data: 'Login fail' };
    }
    return { status: false, data: 'Something went wrong' };
  }
};
