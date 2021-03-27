import React from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import IChatInputBoxView from './IChatInputBoxView';

const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { value, onInputChanged, onInputSubmit }: IChatInputBoxView) => (
    <div className="chat-box-container">
        <InputGroup size="md">
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
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={onInputSubmit} colorScheme="teal">
                    send
                </Button>
            </InputRightElement>
        </InputGroup>
    </div>
);

export default ChatInputBoxView;