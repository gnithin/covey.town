import React from 'react';
import { Box } from '@chakra-ui/react';
import ConversationsList from './conversationsList';
import ChatInputBox from './chatInputBox';


export const SpatialChatContainer: React.FunctionComponent = () =>
(
    <div>
        Spatial chat container
        <ConversationsList />
        <Box pos="absolute" bottom="0" width="30%" height="75px">
            <ChatInputBox />
        </Box>
        
    </div>
);

export default SpatialChatContainer;