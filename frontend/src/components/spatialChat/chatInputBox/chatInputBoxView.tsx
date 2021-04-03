import React, { useState, useRef, useEffect } from 'react';
import { Button, Input } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons';
import ReactQuill from 'react-quill';
import IChatInputBoxView from './IChatInputBoxView';
import 'react-quill/dist/quill.snow.css';
import './customEditor.css';
import Constants from '../../../constants';
import { ChatEditorType } from '../../../classes/SpatialChat';


const ChatInputBoxView: React.FunctionComponent<IChatInputBoxView> = (
    { onInputSubmit, chatEditorType }: IChatInputBoxView) => {
    const [chatMessage, setChatMessage] = useState("");
    const prevEditorRef = useRef<ChatEditorType | null>(null);
    const richTextEditorRef = useRef<ReactQuill>(null);

    useEffect(() => {
        if (prevEditorRef.current !== null) {
            switch (chatEditorType) {
                case ChatEditorType.DEFAULT_EDITOR:
                    if (
                        prevEditorRef.current === ChatEditorType.RICH_TEXT_EDITOR
                        && richTextEditorRef.current !== null
                    ) {
                        // Perform conversion from rich-text to default editor
                        const editor = richTextEditorRef.current.getEditor();
                        setChatMessage(editor.getText());
                    }
                    break;

                case ChatEditorType.RICH_TEXT_EDITOR:
                    if (prevEditorRef.current === ChatEditorType.DEFAULT_EDITOR) {
                        // No conversions required
                    }
                    break;

                default:
            }
        }
        prevEditorRef.current = chatEditorType
    }, [chatEditorType]);

    const submitHandler = async () => {
        await onInputSubmit(chatMessage);
        setChatMessage("");
    }

    return (
        <>
            {(chatEditorType === ChatEditorType.RICH_TEXT_EDITOR) &&
                <ReactQuill
                    theme="snow"
                    className="custom-quill-changes"
                    ref={richTextEditorRef}
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