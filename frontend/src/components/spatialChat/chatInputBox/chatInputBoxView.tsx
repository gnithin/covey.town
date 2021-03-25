import React, { useState } from 'react';
import { Input } from '@chakra-ui/react'

export const ChatInputBoxView: React.FunctionComponent = () => {
    const [chat, setChat] = useState("");
    return (
        <div className="chat-box-container">
            <Input
                placeholder="Say Something..."
                size="lg"
                value={chat}
                onChange={(e) => {
                    setChat(e.target.value);
                }}
            />
        </div>
    )
};

export default ChatInputBoxView;