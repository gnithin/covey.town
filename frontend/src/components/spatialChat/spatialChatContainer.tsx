import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client';
import ConversationsList from './conversationsList';
import ChatInputBox from './chatInputBox';
import { ServerChatEntry, ChatEntry } from '../../classes/SpatialChat';
import { addNewChatEntryAction } from '../../redux/actions'
import constants from '../../constants';

interface ISpatialChatContainerProps {
    socket: Socket | null
}

export const SpatialChatContainer: React.FunctionComponent<ISpatialChatContainerProps> = ({ socket }: ISpatialChatContainerProps) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const receiveChatMessageListener = (receiveChatMessage: ServerChatEntry) => {
            dispatch(
                addNewChatEntryAction(ChatEntry.fromServerChat(receiveChatMessage))
            );
        };

        socket?.on('receiveChatMessage', receiveChatMessageListener);
        return () => {
            // Unsubscribe to the current listener
            socket?.off('receiveChatMessage', receiveChatMessageListener);
        }
    }, [socket, dispatch])

    return (
        <div style={{
            backgroundColor: '#F0FFF4',
            height: constants.PHASER_HEIGHT,
            display: "flex",
            flexDirection: "column",
            padding: "5px 5px",
        }}>
            {/* NOTE: Before changing the layout or the styling, make sure to test out the CSS. It is pretty delicately placed */}
            <ConversationsList />
            <ChatInputBox />
        </div>
    )
};

export default SpatialChatContainer;