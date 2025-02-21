import { AnyAction } from 'redux';
import { ChatReducerState } from "../reduxInterfaces";
import { actionTypes } from '../actions'
import { ChatEditorType } from '../../classes/SpatialChat';
import constants from '../../constants';

const initialState: ChatReducerState = {
    chats: [],
    settingChatEditorType: ChatEditorType.DEFAULT_EDITOR,
    settingChatBroadcastRadius: constants.DEFAULT_BROADCAST_RADIUS,
    blockedPlayerIds: [],
};

const chatReducer = (state: ChatReducerState = initialState, action: AnyAction): ChatReducerState => {
    switch (action.type) {
        case actionTypes.ACTION_ADD_CHAT_ENTRY:
            return {
                ...state,
                chats: [
                    ...state.chats,
                    action.chatEntry,
                ],
            };

        case actionTypes.ACTION_CHANGE_EDITOR_TYPE:
            return {
                ...state,
                settingChatEditorType: action.editorType,
            }

        case actionTypes.ACTION_CHANGE_BROADCAST_RADIUS:
            return {
                ...state,
                settingChatBroadcastRadius: action.broadcastRadius
            }

        case actionTypes.ACTION_BLOCK_PLAYER:
            return {
                ...state,
                blockedPlayerIds: [
                    ...state.blockedPlayerIds,
                    action.playerId,
                ],
            };

        case actionTypes.ACTION_UNBLOCK_PLAYER:
            return {
                ...state,
                blockedPlayerIds: state.blockedPlayerIds.filter(id => id !== action.playerId),
            }

        default:
            return state;
    }
}

export default chatReducer;
