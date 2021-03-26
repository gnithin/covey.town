import React from 'react';
import { Input } from '@chakra-ui/react'
import IChatInputBoxView from './IChatInputBoxView';

const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { value, onInputChanged, onInputSubmit }: IChatInputBoxView) => (
    <div className="chat-box-container">
        <Input
            placeholder="Say Something..."
            size="lg"
            value={value}
            onChange={(e) => {
                onInputChanged(e.target.value);
            }}
            onKeyPress={async (e) => {
                if (e.key === "Enter") {
                    await onInputSubmit();
                }
            }}
        />
    </div>
);

export default ChatInputBoxView;