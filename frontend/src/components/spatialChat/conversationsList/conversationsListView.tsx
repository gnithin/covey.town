import {
    Tag, Text, Stack, Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuIcon,
    MenuCommand,
    MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment'
import { ChatEntry } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store'
import useCoveyAppState from '../../../hooks/useCoveyAppState';
import ConversationView from './conversationView';

export const ConversationsListView: React.FunctionComponent = () => {
    const chatList: ChatEntry[] = useSelector((state: RootState) => state.chat.chats);
    const parentRef = useRef(null);
    const { userName } = useCoveyAppState();

    useEffect(() => {
        if (parentRef) {
            const currentNode = (parentRef.current as any);
            currentNode.scrollTop = currentNode.scrollHeight;
        }
    }, [parentRef, chatList]);

    return (
        <Box
            data-testid="conversations-wrapper"
            style={{
                height: "100%",
                overflow: "scroll",
                padding: "10px 10px",
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
                                    {chatEntry.sender.userName}
                                </span>
                                <span style={{
                                    fontSize: "70%",
                                    marginLeft: "3px",
                                }}>
                                    <i>{moment(chatEntry.timestamp).fromNow()}</i>
                                </span>
                            </Text>
                            <ConversationView chatEntry={chatEntry} />
                        </Box >
                    ))
                }
            </Stack>
        </Box>
    );
};

export default ConversationsListView;

