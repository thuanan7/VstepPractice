import { combineReducers } from 'redux'
import { authSlice } from '@/features/auth/authSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authTransform from './authTransform'

const persistConfig = {
  key: 'root',
  storage,
  transforms: [authTransform],
}
export const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authSlice.reducer),
})
