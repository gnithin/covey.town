import React from 'react';
import { Box } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import ConversationsList from './conversationsList';
import ChatInputBox from './chatInputBox';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import { ServerChatEntry, ChatEntry } from '../../classes/SpatialChat';
import { addNewChatEntryAction } from '../../redux/actions'

export const SpatialChatContainer: React.FunctionComponent = () => {
    const dispatch = useDispatch();

    const { socket } = useCoveyAppState();
    socket?.on('receiveChatMessage', (receiveChatMessage: ServerChatEntry) => {
        dispatch(
            addNewChatEntryAction(ChatEntry.fromServerChat(receiveChatMessage))
        );
    });

    return (
        <div>
            Spatial chat container
            <ConversationsList />
            <Box pos="absolute" bottom="0" width="30%" height="75px">
                <ChatInputBox />
            </Box>
        </div>
    )
};

export default SpatialChatContainer;