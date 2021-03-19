import React from 'react';
import ConversationsList from './conversationsList';
import ChatInputBox from './chatInputBox';

export const SpatialChatContainer: React.FunctionComponent = () =>
(
    <div>
        Spatial chat container
        <ConversationsList />
        <ChatInputBox />
    </div>
);

export default SpatialChatContainer;