import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ConversationsList from './conversationsList';
import ChatInputBox from './chatInputBox';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import { ServerChatEntry, ChatEntry } from '../../classes/SpatialChat';
import { addNewChatEntryAction } from '../../redux/actions'
import constants from '../../constants';


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
        <div style={{
            backgroundColor: '#F0FFF4',
            height: constants.PHASER_HEIGHT,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            padding: "5px 5px",
        }}>
            <div style={{
                height: "90%",
            }}>
                <ConversationsList />
            </div>
            <div style={{
                justifySelf: 'flex-end',
            }}>
                <ChatInputBox />
            </div>
        </div>
    )
};

export default SpatialChatContainer;