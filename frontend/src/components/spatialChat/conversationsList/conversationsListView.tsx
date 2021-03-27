import { HStack, Tag, VStack, Text, Stack, Box, Heading, Container } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { ChatEntry } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store'

export const ConversationsListView: React.FunctionComponent = () => {
    const chatList: ChatEntry[] = useSelector((state: RootState) => state.chat.chats);
    return (

        // <>
        //     <Stack spacing={4}>
        //     {
        //         chatList.map((chatEntry) => (
        //             <Box key={chatEntry.generateKey()} >
        //                 <Text>{`@${chatEntry.timestamp} ${chatEntry.sender}`}</Text>
        //                 <Tag size="lg" variant="solid" colorScheme='blue'>{chatEntry.message}</Tag>
        //             </Box>
        //         ))
        //     }
        //     </Stack>
        // </>

        
        
        // The above commented out is what we will use, below is just example. 
        // See textAlign example on line 30. The above case would probably be something like 
        // textAlign={chatEntry.sender===myself ? 'right' : 'left'}
        <>
        <Stack spacing={4}>
        {
            ["sm", "md", "lg"].map((size) => (
                <Box key={size} textAlign={size==="lg"? 'right' : 'left'}>
                    <Text>@14:50 Manager</Text>
                    <Tag size="lg" variant="solid" colorScheme='blue'>{size}</Tag>
                </Box >
            ))
        }
        </Stack>
        </>
        
    );
};

export default ConversationsListView;