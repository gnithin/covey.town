import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { updateCurrentMessageAction } from '../../../redux/actions';
import ChatInputBoxView from './chatInputBoxView';
import useCoveyAppState from '../../../hooks/useCoveyAppState';

const ChatInputBoxContainer: React.FunctionComponent = () => {
    const chat = useSelector((state: RootState) => state.chat.current_message);
    const dispatch = useDispatch();

    const { socket } = useCoveyAppState();
    const sendChatMessage = () => {
        socket?.emit('sendChatMessage', {
            message: chat,
            borderRadius: 80,
        });
    }

    return (
        <ChatInputBoxView
            value={chat}
            onInputChanged={(inputValue) => {
                dispatch(updateCurrentMessageAction(inputValue));
            }}
            onInputSubmit={async () => {
                sendChatMessage();
            }}
        />
    )
};

export default ChatInputBoxContainer;