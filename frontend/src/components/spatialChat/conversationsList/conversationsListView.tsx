import { HStack, Tag, VStack, Text, Stack, Box, Heading, Container } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChatEntry } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store'

export const ConversationsListView: React.FunctionComponent = () => {
    const chatList: ChatEntry[] = useSelector((state: RootState) => state.chat.chats);
    return (
        <Box data-testid="conversations-wrapper">
            <Stack spacing={4}>
                {
                    chatList.map((chatEntry) => (
                        <Box key={chatEntry.generateKey()}>
                            <Text>{`@${chatEntry.timestamp} ${chatEntry.sender.userName}`}</Text>
                            <Tag size="lg" variant="solid" colorScheme='blue'>{chatEntry.message}</Tag>
                        </Box >
                    ))
                }
            </Stack>
        </Box>
    );
};

export default ConversationsListView;