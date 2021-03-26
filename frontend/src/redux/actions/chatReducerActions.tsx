import { AnyAction } from "redux";
import { ChatEntry } from "../../classes/SpatialChat";
import actionTypes from "./actionTypes";

export const updateCurrentMessageAction = (currentMessage: string): AnyAction => ({
    type: actionTypes.ACTION_UPDATE_CURRENT_MESSAGE,
    currentMessage
})

export const addNewChatEntryAction = (chatEntry: ChatEntry): AnyAction => ({
    type: actionTypes.ACTION_ADD_CHAT_ENTRY,
    chatEntry,
});
