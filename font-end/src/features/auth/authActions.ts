import * as authClients from '@/features/auth/authServices';
import { startLogin, loginFail, loginSuccess } from '@/features/auth/authSlice';
import { ILoginRespSuccess } from '@/features/auth/authServices';

export const loginSync = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch(startLogin());
    const rs = await authClients.loginSync(email, password);
    if (rs.status) {
      dispatch(loginSuccess(rs.data as ILoginRespSuccess));
    } else {
      dispatch(loginFail(`${rs.message}`));
    }
  } catch (err: any) {
    dispatch(loginFail('Something is wrong'));
  }
};
