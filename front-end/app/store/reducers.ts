import { combineReducers, Reducer } from 'redux';
const appReducer = combineReducers({
});
export const rootReducer: Reducer = (state: any, action: any) => {
    // @ts-ignore
    return appReducer(state, action);
};
