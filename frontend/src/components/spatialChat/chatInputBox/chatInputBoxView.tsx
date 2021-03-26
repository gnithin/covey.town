import React from 'react';
import { Input } from '@chakra-ui/react'
import IChatInputBoxView from './IChatInputBoxView';

const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { value, onInputChanged }: IChatInputBoxView) => (
    <div className="chat-box-container">
        <Input
            placeholder="Say Something..."
            size="lg"
            value={value}
            onChange={(e) => {
                onInputChanged(e.target.value);
            }}
        />
    </div>
);

export default ChatInputBoxView;