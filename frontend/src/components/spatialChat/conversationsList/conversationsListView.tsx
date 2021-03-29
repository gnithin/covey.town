import { HStack, Tag, VStack, Text, Stack, Box, Heading, Container } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChatEntry } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store'

export const ConversationsListView: React.FunctionComponent = () => {
    const chatList: ChatEntry[] = useSelector((state: RootState) => state.chat.chats);
    return (
        <Box backgroundColor='#F0FFF4' w="100%" height={690}>
            <Stack spacing={4}>
                {
                    chatList.map((chatEntry) => (
                        <Box key={chatEntry.generateKey()}>
                            <Text>{`@${chatEntry.timestamp} ${chatEntry.sender}`}</Text>
                            <Tag size="lg" variant="solid" colorScheme='blue'>{chatEntry.message}</Tag>
                        </Box >
                    ))
                }
            </Stack>
        </Box>
    );
};

export default ConversationsListView;