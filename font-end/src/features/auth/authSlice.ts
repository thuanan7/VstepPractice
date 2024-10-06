import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

import { loginSync } from './authActions';
import { ILoginRespSuccess } from '@/features/auth/authServices';
import { setData } from '@/features/core/ls';
import { keyLs } from '@/features/auth/configs';

export interface IAuth {
  isLoading: boolean;
  errorMsg?: string;
  accessToken?: string;
}

const initialState: IAuth = { isLoading: false };
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      setData(keyLs.accessToken, '');
      return {
        ...state,
        errorMsg: '',
        accessToken: undefined,
        isLoading: false,
      };
    },
    startLogin: state => {
      setData(keyLs.accessToken, '');
      return {
        ...state,
        errorMsg: '',
        accessToken: undefined,
        isLoading: true,
      };
    },
    loginSuccess: (state, action: PayloadAction<ILoginRespSuccess>) => {
      const { accessToken } = action.payload;
      setData(keyLs.accessToken, accessToken);
      return {
        ...state,
        accessToken,
        isLoading: false,
      };
    },
    loginFail: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        errorMsg: action?.payload,
        isLoading: false,
      };
    },
  },
});
export const { startLogin, logout, loginSuccess, loginFail } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth || { isLoading: false };
export const selectIsAuthenticated = (state: RootState) => state?.auth?.accessToken && state?.auth?.accessToken !== '';

export { loginSync };
export const authReducer = authSlice.reducer;
