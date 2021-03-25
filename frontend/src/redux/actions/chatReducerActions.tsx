import { AnyAction } from "redux";
import actionTypes from "./actionTypes";

const updateCurrentMessageAction = (currentMessage: string): AnyAction => ({
    type: actionTypes.ACTION_UPDATE_CURRENT_MESSAGE,
    currentMessage
})
export default updateCurrentMessageAction;