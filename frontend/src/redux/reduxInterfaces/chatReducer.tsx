export interface Chat {
    message: string;
}

export interface ChatReducerState {
    chats: Chat[];
    current_message: string;
}