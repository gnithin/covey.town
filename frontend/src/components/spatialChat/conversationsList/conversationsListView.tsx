import React from 'react';
import { useSelector } from 'react-redux';
import { ChatEntry } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store'

export const ConversationsListView: React.FunctionComponent = () => {
    const chatList: ChatEntry[] = useSelector((state: RootState) => state.chat.chats);
    return (
        <div>
            <ul>
                Conversations List view
                {
                    chatList.map((chatEntry) =>
                        <li key={chatEntry.generateKey()}>{chatEntry.message}</li>
                    )
                }
            </ul>
        </div>
    );
};

export default ConversationsListView;