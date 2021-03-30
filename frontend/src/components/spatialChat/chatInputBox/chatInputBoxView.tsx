import React from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons';
import IChatInputBoxView from './IChatInputBoxView';


const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { value, onInputChanged, onInputSubmit }: IChatInputBoxView) => (
    <div className="chat-box-container" style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    }}>
        <Input
            style={{
                backgroundColor: "#FFF", // It's soo odd that it defaults to transparent :D
            }}
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
        <Button
            onClick={onInputSubmit}
            size="lg"
            style={{
                padding: 0,
                backgroundColor: '#BDFFCF',
            }}
            aria-label='send-chat'
        >
            <ChatIcon />
        </Button>
    </div>
);

export default ChatInputBoxView;