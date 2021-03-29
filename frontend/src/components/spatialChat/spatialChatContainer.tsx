import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ConversationsList from './conversationsList';
import ChatInputBox from './chatInputBox';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import { ServerChatEntry, ChatEntry } from '../../classes/SpatialChat';
import { addNewChatEntryAction } from '../../redux/actions'


export const SpatialChatContainer: React.FunctionComponent = () => {
    const dispatch = useDispatch();
    const { socket } = useCoveyAppState();


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
        <div>
            <ConversationsList />
            <ChatInputBox />
        </div>
    )
};

export default SpatialChatContainer;