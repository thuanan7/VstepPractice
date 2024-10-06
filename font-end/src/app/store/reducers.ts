import { authReducer } from '@/features/auth/authSlice';
import { combineReducers, Reducer } from 'redux';
const appReducer = combineReducers({
  auth: authReducer,
});
export const rootReducer: Reducer = (state: any, action: any) => {
  return appReducer(state, action);
};
