import { ChatEditorType, ChatEntry } from "../../classes/SpatialChat";

export interface ChatReducerState {
    chats: ChatEntry[];
    settingChatEditorType: ChatEditorType,
    settingChatBroadcastRadius: number,
    blockedPlayerIds: string[];
}
