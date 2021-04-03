import React from 'react';
import ChatInputBoxView from './chatInputBoxView';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import Constants from '../../../constants';
import { ChatEditorType } from '../../../classes/SpatialChat';

const ChatInputBoxContainer: React.FunctionComponent = () => {
    const { socket } = useCoveyAppState();
    const sendChatMessage = (chatMessage: string) => {
        socket?.emit('sendChatMessage', {
            message: chatMessage,
            // TODO: Remove this hard-coded entry
            broadcastRadius: Constants.DEFAULT_BROADCAST_RADIUS,
        });
    }

    return (
        <div data-testid="chat-input-box-wrapper">
            <div className="chat-box-container" style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}>

                <ChatInputBoxView
                    onInputSubmit={async (chatMessage) => {
                        sendChatMessage(chatMessage);
                    }}
                    chatEditorType={ChatEditorType.RICH_TEXT_EDITOR}
                />
            </div>
        </div>
    )
};

export default ChatInputBoxContainer;