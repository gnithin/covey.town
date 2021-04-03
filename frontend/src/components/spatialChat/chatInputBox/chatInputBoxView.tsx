import React, { useState, useRef, useEffect } from 'react';
import { Input, Button } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons';
import ReactQuill from 'react-quill';
import IChatInputBoxView from './IChatInputBoxView';
import Constants from '../../../constants';
import 'react-quill/dist/quill.snow.css';
import { ChatEditorType } from '../../../classes/SpatialChat';


const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { onInputSubmit, chatEditorType }: IChatInputBoxView) => {
    const [chatMessage, setChatMessage] = useState("");

    const submitHandler = async () => {
        await onInputSubmit(chatMessage);
        setChatMessage("");
    }

    return (
        <>
            <ReactQuill
                className={Constants.CUSTOM_PRIORITY_FOCUS_CLASS_FOR_INPUT}
                theme="snow"
                value={chatMessage}
                onChange={setChatMessage}
            />

            {/* <Input
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
                        await submitHandler();
                    }
                }}
                className={Constants.CUSTOM_PRIORITY_FOCUS_CLASS_FOR_INPUT}
            /> */}

            <Button
                onClick={async () => { await submitHandler() }}
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