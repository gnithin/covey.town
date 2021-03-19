import { createStore } from 'redux'
import reducer from '../reducers';

const store = createStore(reducer)

if (process.env.NODE_ENV === 'development') {
    (window as any).store = store;
}

export default store;