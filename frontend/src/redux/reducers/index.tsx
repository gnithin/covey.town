import { combineReducers } from 'redux';
import chatReducer from './chat';

const reducer = combineReducers({
    chat: chatReducer,
})

export default reducer;
