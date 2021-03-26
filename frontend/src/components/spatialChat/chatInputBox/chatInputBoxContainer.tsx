import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { updateCurrentMessageAction } from '../../../redux/actions';
import ChatInputBoxView from './chatInputBoxView';

const ChatInputBoxContainer: React.FunctionComponent = () => {
    const chat = useSelector((state: RootState) => state.chat.current_message);
    const dispatch = useDispatch();

    return (
        <ChatInputBoxView
            value={chat}
            onInputChanged={(inputValue) => {
                dispatch(updateCurrentMessageAction(inputValue));
            }}
        />
    )
};

export default ChatInputBoxContainer;