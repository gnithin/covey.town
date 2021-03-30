import { Tag, Text, Stack, Box } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment'
import { ChatEntry } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store'

export const ConversationsListView: React.FunctionComponent = () => {
    const chatList: ChatEntry[] = useSelector((state: RootState) => state.chat.chats);
    const parentRef = useRef(null);
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
                paddingBottom: "10px",
            }}
            ref={parentRef}
        >
            <Stack spacing={4}>
                {
                    chatList.map((chatEntry) => (
                        <Box key={chatEntry.generateKey()} style={{
                            textAlign: "left"
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
                            <Tag size="lg" variant="solid" style={{
                                backgroundColor: 'rgb(189, 255, 207)',
                                color: "#000",
                            }}>
                                {chatEntry.message}
                            </Tag>
                        </Box >
                    ))
                }
            </Stack>
        </Box>
    );
};

export default ConversationsListView;