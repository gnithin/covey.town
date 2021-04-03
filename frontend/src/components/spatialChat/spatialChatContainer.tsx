import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client';
import {
    Heading, Box, Tooltip,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import ConversationsList from './conversationsList';
import ChatInputBox from './chatInputBox';
import { ServerChatEntry, ChatEntry } from '../../classes/SpatialChat';
import { addNewChatEntryAction } from '../../redux/actions'
import constants from '../../constants';

interface ISpatialChatContainerProps {
    socket: Socket | null
}

export const SpatialChatContainer: React.FunctionComponent<ISpatialChatContainerProps> = ({ socket }: ISpatialChatContainerProps) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const receiveChatMessageListener = (receiveChatMessage: ServerChatEntry) => {
            dispatch(
                addNewChatEntryAction(ChatEntry.fromServerChat(receiveChatMessage))
            );
        };

        socket?.on('receiveChatMessage', receiveChatMessageListener);
        return () => {
            // Unsubscribe to the current listener
            socket?.off('receiveChatMessage', receiveChatMessageListener);
        }
    }, [socket, dispatch])

    return (
        <div style={{
            backgroundColor: '#F0FFF4',
            height: constants.PHASER_HEIGHT,
            display: "flex",
            flexDirection: "column",
            padding: "5px 5px",
            position: "relative",
        }}>
            <Box style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50px",
                backgroundColor: "#BDFFCF",
                borderBottom: "1px solid #F0FFF4",
            }}>
                <div style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                }}>
                    <Heading as="h3" size="md" isTruncated>
                        Spatial Chat
                    </Heading>
                    <Tooltip
                        label="Hold a conversation with anyone near you! Spatial chat sends messages automatically to those around you, skipping the rest of the folks in the town. Click on the Chat-Settings link (at the bottom of the page) for configuration options"
                        aria-label="A tooltip"
                    >
                        <QuestionOutlineIcon />
                    </Tooltip>
                </div>
            </Box>
            {/* NOTE: Before changing the layout or the styling, make sure to test out the CSS. It is pretty delicately placed */}
            <ConversationsList />
            <ChatInputBox />
        </div>
    )
};

export default SpatialChatContainer;