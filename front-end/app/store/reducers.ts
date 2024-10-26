import { combineReducers, Reducer } from 'redux'
import { authSlice } from '@/features/auth/authSlice.ts'
const appReducer = combineReducers({
  auth: authSlice.reducer,
})
export const rootReducer: Reducer = (state: any, action: any) => {
  // @ts-ignore
  return appReducer(state, action)
}
