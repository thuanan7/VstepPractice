import { createSlice } from '@reduxjs/toolkit';
import i18next from 'i18next';
export interface IAppState {
  appTitle?: string;
}

export const AppStateDefault: IAppState = {
  appTitle: '',
};
export const appSlice = createSlice({
  name: 'app',
  initialState: AppStateDefault,
  reducers: {
    setAppTitle: (state, { payload }) => {
      state.appTitle = payload;
    },
    setLangCode: (state: any, action: any): void => {
      state.lang = action.payload;
    },
  },
});
export const { setAppTitle, setLangCode } = appSlice.actions;
export const appSelector = (state: any) => state.app as IAppState;

export function handleErrorAction(error: any, rejectWithValue: (value: string) => void) {
  if (error.message === 'Network Error') {
    return rejectWithValue(i18next.t('login:error.cantAccessUrlLogin'));
  }
  if (error.response && Object.hasOwnProperty.call(error.response, 'message')) {
    return rejectWithValue(i18next.t(`login:${error.response.message}`));
  }
  return rejectWithValue('Error!!');
}

export default appSlice.reducer;
