import React, { useState } from 'react';
import { Input, Button } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons';
import IChatInputBoxView from './IChatInputBoxView';
import Constants from '../../../constants';


const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { onInputSubmit }: IChatInputBoxView) => {
    const [chatMessage, setChatMessage] = useState("");

    return (
        <>
            <Input
                style={{
                    backgroundColor: "#FFF", // It's soo odd that it defaults to transparent :D
                }}
                placeholder="Say Something..."
                size="lg"
                value={chatMessage}
                onChange={(e) => {
                    setChatMessage(e.target.value);
                }}
                onKeyPress={async (e) => {
                    if (e.key === "Enter") {
                        await onInputSubmit(chatMessage);
                    }
                }}
                className={Constants.PRIORITY_FOCUS_CLASS_FOR_INPUT}
            />

            <Button
                onClick={() => onInputSubmit(chatMessage)}
                size="lg"
                style={{
                    padding: 0,
                    backgroundColor: '#BDFFCF',
                }}
                aria-label='send-chat'
            >
                <ChatIcon />
            </Button>
        </>
    )
};

export default ChatInputBoxView;