import React from 'react';
import { Input } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ACTION_UPDATE_CURRENT_MESSAGE } from '../../../redux/actions';

export const ChatInputBoxView: React.FunctionComponent = () => {
    const chat = useSelector((state: RootState) => state.chat.current_message);
    const dispatch = useDispatch();

    return (
        <div className="chat-box-container">
            <Input
                placeholder="Say Something..."
                size="lg"
                value={chat}
                onChange={(e) => {
                    dispatch({
                        type: ACTION_UPDATE_CURRENT_MESSAGE,
                        current_message: e.target.value,
                    });
                }}
            />
        </div>
    )
};

export default ChatInputBoxView;