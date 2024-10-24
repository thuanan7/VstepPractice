import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
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
    },
});
export const selectAuth = (state: RootState) => state.auth || { isLoading: false };
export const selectIsAuthenticated = (state: RootState) => state?.auth?.accessToken && state?.auth?.accessToken !== '';
export const authReducer = authSlice.reducer;
