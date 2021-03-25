import { createStore } from 'redux'
import reducer from '../reducers';

const store = createStore(reducer)

if (process.env.NODE_ENV === 'development') {
    (window as any).store = store;
}

export default store;

// Infer the types for the root state and dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;