import {
    Text, Stack, Box,
} from '@chakra-ui/react';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment'
import { ChatEntry } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store'
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import ConversationView from './conversationView';

export const ConversationsListView: React.FunctionComponent = () => {
    const chatList: ChatEntry[] = useSelector((state: RootState) => state.chat.chats);
    const parentRef = useRef<HTMLDivElement>(null);
    const { userName } = useCoveyAppState();

    useEffect(() => {
        if (parentRef) {
            const currentNode = parentRef.current;
            if (currentNode !== null) {
                currentNode.scrollTop = currentNode.scrollHeight;
            }
        }
    }, [parentRef, chatList]);

    /* NOTE: Before changing the layout or the styling, make sure to test out the CSS. It is pretty delicately placed */
    return (
        <div
            data-testid="conversations-wrapper"
            style={{
                flex: "auto",
                overflow: "scroll",
                padding: "10px 5px",
                paddingTop: "50px",
            }}
            ref={parentRef}
        >
            <Stack spacing={4}>
                {
                    chatList.map((chatEntry) => (
                        <Box key={chatEntry.generateKey()} style={{
                            textAlign: (chatEntry.sender.userName === userName) ? "right" : "left",
                        }}>
                            <Text>
                                <span style={{
                                    fontSize: "90%",
                                    fontWeight: "bold"
                                }}>
                                    {
                                        (chatEntry.sender.userName === userName) ?
                                            "Me" : chatEntry.sender.userName
                                    }
                                </span>
                                <span style={{
                                    fontSize: "70%",
                                    marginLeft: "3px",
                                }}>
                                    <i>{moment(chatEntry.timestamp).fromNow()}</i>
                                </span>
                            </Text>
                            <ConversationView
                                chatEntry={chatEntry}
                                loggedInUsername={userName}
                            />
                        </Box >
                    ))
                }
            </Stack>
        </div>
    );
};

export default ConversationsListView;

