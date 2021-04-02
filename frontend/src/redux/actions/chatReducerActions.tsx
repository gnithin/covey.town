import { AnyAction } from "redux";
import { ChatEntry } from "../../classes/SpatialChat";
import actionTypes from "./actionTypes";

// eslint-disable-next-line import/prefer-default-export
export const addNewChatEntryAction = (chatEntry: ChatEntry): AnyAction => ({
    type: actionTypes.ACTION_ADD_CHAT_ENTRY,
    chatEntry,
});
