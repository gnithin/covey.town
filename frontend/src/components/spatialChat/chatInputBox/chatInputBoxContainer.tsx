import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { updateCurrentMessageAction } from '../../../redux/actions';
import ChatInputBoxView from './chatInputBoxView';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import Constants from '../../../constants';

const ChatInputBoxContainer: React.FunctionComponent = () => {
    const chat = useSelector((state: RootState) => state.chat.current_message);
    const dispatch = useDispatch();

    const { socket } = useCoveyAppState();
    const sendChatMessage = () => {
        socket?.emit('sendChatMessage', {
            message: chat,
            broadcastRadius: Constants.DEFAULT_BROADCAST_RADIUS,
        });

        // Set the input to empty after submitting
        dispatch(updateCurrentMessageAction(""));
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