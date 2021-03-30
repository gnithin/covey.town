import React from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import IChatInputBoxView from './IChatInputBoxView';

const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { value, onInputChanged, onInputSubmit }: IChatInputBoxView) => (
    <div className="chat-box-container">
        <InputGroup size="md">
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
            <InputRightElement>
                <Button size="sm" onClick={onInputSubmit} colorScheme="teal">
                    send
                </Button>
            </InputRightElement>
        </InputGroup>
    </div>
);

export default ChatInputBoxView;