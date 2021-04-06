import React from 'react';
import { useSelector } from 'react-redux';
import ChatInputBoxView from './chatInputBoxView';
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import { RootState } from '../../../redux/store';

const ChatInputBoxContainer: React.FunctionComponent = () => {
    const { socket } = useCoveyAppState();
    const broadcastRadius = useSelector((state: RootState) => state.chat.settingChatBroadcastRadius);

    const sendChatMessage = (chatMessage: string, radius: number) => {
        socket?.emit('sendChatMessage', {
            message: chatMessage,
            broadcastRadius: radius,
        });
    }

    /* NOTE: Before changing the layout or the styling, make sure to test out the CSS. It is pretty delicately placed */
    return (
        <div data-testid="chat-input-box-wrapper" style={{
            flex: "none",
        }}>
            <div className="chat-box-container" style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}>

                <ChatInputBoxView
                    onInputSubmit={async (chatMessage) => {
                        sendChatMessage(chatMessage, broadcastRadius);
                    }}
                />
            </div>
        </div>
    )
};

export default ChatInputBoxContainer;