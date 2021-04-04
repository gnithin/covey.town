import { AnyAction } from "redux";
import { ChatEditorType, ChatEntry } from "../../classes/SpatialChat";
import actionTypes from "./actionTypes";

// eslint-disable-next-line import/prefer-default-export
export const addNewChatEntryAction = (chatEntry: ChatEntry): AnyAction => ({
    type: actionTypes.ACTION_ADD_CHAT_ENTRY,
    chatEntry,
});

export const changeEditorTypeAction = (editorType: ChatEditorType): AnyAction => ({
    type: actionTypes.ACTION_CHANGE_EDITOR_TYPE,
    editorType,
})

export const changeBroadcastRadius = (broadcastRadius: number): AnyAction => ({
    type: actionTypes.ACTION_CHANGE_BROADCAST_RADIUS,
    broadcastRadius,
})

export const blockPlayerAction = (playerId: string): AnyAction => ({
    type: actionTypes.BLOCK_PLAYER,
    playerId,
})

export const unblockPlayerAction = (playerId: string): AnyAction => ({
    type: actionTypes.UNBLOCK_PLAYER,
    playerId,
})
