import { AnyAction } from 'redux';
import { ChatReducerState } from "../reduxInterfaces";
import { actionTypes } from '../actions'
import { ChatEditorType } from '../../classes/SpatialChat';

const initialState: ChatReducerState = {
    chats: [],
    settingChatEditorType: ChatEditorType.DEFAULT_EDITOR,
};

const chatReducer = (state: ChatReducerState = initialState, action: AnyAction): ChatReducerState => {
    switch (action.type) {
        case actionTypes.ACTION_ADD_CHAT_ENTRY:
            return {
                ...state,
                chats: [
                    ...state.chats,
                    action.chatEntry,
                ]
            };

        default:
            return state;
    }
}

export default chatReducer;