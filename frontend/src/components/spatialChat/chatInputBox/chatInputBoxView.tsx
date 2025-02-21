import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import IChatInputBoxView from './IChatInputBoxView';
import 'react-quill/dist/quill.snow.css';
import './customEditor.css';
import Constants from '../../../constants';
import { ChatEditorType } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store';

const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { onInputSubmit }: IChatInputBoxView) => {
    const chatEditorType = useSelector((state: RootState) => state.chat.settingChatEditorType);
    const [chatMessage, setChatMessage] = useState("");
    const prevEditorRef = useRef<ChatEditorType | null>(null);

    useEffect(() => {
        if (prevEditorRef.current !== null) {
            switch (chatEditorType) {
                case ChatEditorType.DEFAULT_EDITOR:
                    if (prevEditorRef.current === ChatEditorType.RICH_TEXT_EDITOR) {
                        setChatMessage(
                            DOMPurify.sanitize(chatMessage, { ALLOWED_TAGS: [] }).trim()
                        );
                    }
                    break;

                case ChatEditorType.RICH_TEXT_EDITOR:
                    if (prevEditorRef.current === ChatEditorType.DEFAULT_EDITOR) {
                        // No conversions required for now
                    }
                    break;

                default:
            }
        }
        prevEditorRef.current = chatEditorType
    }, [chatEditorType, chatMessage, setChatMessage]);

    const canSubmitMessage = (message: string): boolean => {
        if (message.trim() === "") {
            return false;
        }

        // Check for tags
        const cleanMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: [] })
        if (cleanMessage.trim() === "") {
            return false;
        }

        return true;
    }

    const submitHandler = async () => {
        const messageToSend = chatMessage.trim();
        if (!canSubmitMessage(messageToSend)) {
            return;
        }

        await onInputSubmit(messageToSend);
        setChatMessage("");
    }

    return (
        <>
            {(chatEditorType === ChatEditorType.RICH_TEXT_EDITOR) &&
                <ReactQuill
                    theme="snow"
                    className="custom-quill-changes"
                    value={chatMessage}
                    onChange={setChatMessage}
                    placeholder="Say Something..."
                    style={{
                        backgroundColor: "#FFF",
                        flexGrow: 2,
                    }}
                    modules={{
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            ['clean'],
                        ],
                    }}
                    formats={[
                        'font', 'bold', 'italic', 'underline', 'strike', 'color', 'background'
                    ]}
                />
            }

            { (chatEditorType === ChatEditorType.DEFAULT_EDITOR) &&
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
                            await submitHandler();
                        }
                    }}
                    className={Constants.CUSTOM_PRIORITY_FOCUS_CLASS_FOR_INPUT}
                />
            }

            <Button
                onClick={async () => { await submitHandler() }}
                size="lg"
                style={{
                    padding: 0,
                    backgroundColor: '#BDFFCF',
                    alignSelf: 'flex-end',
                }}
                aria-label='send-chat'
            >
                <ChatIcon />
            </Button>
        </>
    )
};

export default ChatInputBoxView;