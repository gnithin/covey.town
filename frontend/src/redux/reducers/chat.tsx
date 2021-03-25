import { AnyAction } from 'redux';
import { ChatReducerState } from "../reduxInterfaces";
import { actionTypes } from '../actions'

const initialState: ChatReducerState = {
    chats: [],
    current_message: ""
};

const chatReducer = (state: ChatReducerState = initialState, action: AnyAction): ChatReducerState => {
    switch (action.type) {
        case actionTypes.ACTION_UPDATE_CURRENT_MESSAGE:
            return {
                ...state,
                current_message: action.current_message
            }

        default:
            return state;
    }
}

export default chatReducer;