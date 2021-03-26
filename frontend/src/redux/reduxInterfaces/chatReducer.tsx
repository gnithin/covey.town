import { ChatEntry } from "../../classes/SpatialChat";

export interface ChatReducerState {
    chats: ChatEntry[];
    current_message: string;
}